import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Storeownerlanding = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [storeOwnerName, setStoreOwnerName] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  
  const Table = ({ columns, data, emptyMessage = "No data found" }) => {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover w-100">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key} className="text-center">
                      {row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-3">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      if (token) {
        try {
          setLoading(true);
          const decoded = jwtDecode(token);
          setUserId(decoded.email);
          setStoreOwnerName(decoded.name || "Store Owner");
          fetchPasswordUpdate(decoded.email);
          await getStoreDetails(decoded.email);

          const storeId = localStorage.getItem("storeID");

          if (storeId) {
            fetchNumberOfRating(storeId);
            fetchAvgRating(storeId);
            fetchUserList(storeId);
          } else {
            console.error("Could not retrieve store ID.");
          }
        } catch (error) {
          console.error("Invalid token or initialization error:", error);
          localStorage.removeItem("token");
          navigate("/");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/");
      }
    };

    initializeDashboard();
  }, [token]);

  const fetchUserList = async (storeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/getUsersWhoRated/${storeId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setUserList(data.rates);
        setFilteredUserList(data.rates);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const fetchPasswordUpdate = async (storeEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/getStoreinfo/${storeEmail}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success && data.store.ispasswordupdated === 0) {
        Swal.fire({
          icon: "warning",
          title: "Update Required",
          text: "Please update your password before continuing!",
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchNumberOfRating = async (storeId) => {
    const response = await fetch(
      `http://localhost:5000/api/getRatingCountByStore/${storeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.success) {
      setRate(data.getStoreCount);
    } else {
      alert(data.msg);
    }
  };

  const getStoreDetails = async (email) => {
    const response = await fetch(
      `http://localhost:5000/api/getStoreByEmail/${email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.success && data.store) {
      localStorage.setItem("storeID", data.store.id);
    } else {
      console.log("Store not found");
    }
  };

  const fetchAvgRating = async (storeId) => {
    const response = await fetch(
      `http://localhost:5000/api/averageRating/${storeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.success) {
      setAverageRating(data.averageRating);
    } else {
      alert(data.msg);
    }
  };

const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!token) return Swal.fire({ icon: "error", title: "Login Required", text: "Please login first." });

    try {
      const res = await fetch(`http://localhost:5000/api/updatepass`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: data.msg,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          localStorage.removeItem("token"); 
          navigate("/"); 
        });
      } else {
        Swal.fire({ icon: "error", title: "Update Failed", text: data.msg || "Something went wrong" });
      }
    } catch (error) {
      console.error("Password update failed:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Unable to update password." });
    }
  };


  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    filterUsers(searchTerm, rating);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterUsers(term, selectedRating);
  };

  const filterUsers = (term, rating) => {
    let filtered = userList;

    if (term) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (rating) {
      filtered = filtered.filter((user) => String(user.rating) === rating);
    }

    setFilteredUserList(filtered);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand">{storeOwnerName}</span>
          <div className="ml-auto d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>
              Update Password
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-star-fill"></i> Average Rating
                </h5>
                <p className="display-4">{Number(averageRating).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-people-fill"></i> Total Ratings
                </h5>
                <p className="display-4">{Number(rate)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">User Ratings</h5>

            
            <div className="d-flex justify-content-end gap-2 mb-3">
              <select
                className="form-select w-auto"
                value={selectedRating}
                onChange={(e) => handleRatingFilter(e.target.value)}
              >
                <option value="">All Ratings</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control w-auto"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            
            <Table
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "rating", label: "Rating" },
              ]}
              data={filteredUserList}
              emptyMessage="No ratings found"
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdatePassword}>
                <div className="modal-header">
                  <h5 className="modal-title">Update Password</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Storeownerlanding;
