import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const NormalUserLanding = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/getStores";

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setName(decoded.name);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch stores");
        }
        setStores(data.stores);
      } catch (error) {
        console.error("Error fetching stores:", error);
        Swal.fire("Error!", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [token]);

  
  const handleRatingSubmit = async (storeID, rating) => {
    if (!rating) {
      Swal.fire("Oops!", "Please select a rating before submitting.", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/rate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeID,
          rating,
          userId,
          name,
          email
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        console.log({ userId, storeID, rating });
        throw new Error(json.msg || json.message || "Failed to submit rating");
      }

      Swal.fire("Success!", json.msg || "Your rating has been submitted!", "success");

      setUserRatings((prev) => ({ ...prev, [storeID]: rating }));
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const filteredStores = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.address && s.address.toLowerCase().includes(q))
    );
  }, [stores, search]);

  const renderStars = (num) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i < num ? "bi-star-fill text-warning" : "bi-star"} me-1`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <>
      
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-person-circle me-2"></i> User Dashboard
        </a>
        <div className="ms-auto">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/");
            }}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4">
       
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">
              <i className="bi bi-shop-window me-2"></i> Stores
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Store Name</th>
                    <th>Address</th>
                    <th>Overall Rating</th>
                    <th>Your Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No stores found.
                      </td>
                    </tr>
                  ) : (
                    filteredStores.map((store) => {
                      const avg = Number(store.averageRating) || 0;
                      return (
                        <tr key={store.id}>
                          <td>{store.name}</td>
                          <td>{store.address}</td>
                          <td>
                            {renderStars(Math.round(avg))}
                            <small className="text-muted ms-2">
                              ({avg.toFixed(1)})
                            </small>
                          </td>
                          <td>
                            {userRatings[store.id] ? (
                              <div>
                                {renderStars(userRatings[store.id])}
                                <small className="text-muted ms-2">
                                  ({userRatings[store.id]})
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted">Not rated</span>
                            )}
                          </td>
                          <td>
                            <select
                              className="form-select d-inline-block w-auto me-2"
                              value={userRatings[store.id] || ""}
                              onChange={(e) =>
                                setUserRatings((prev) => ({
                                  ...prev,
                                  [store.id]: Number(e.target.value),
                                }))
                              }
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                handleRatingSubmit(store.id, userRatings[store.id])
                              }
                              disabled={!userRatings[store.id]}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              {userRatings[store.id] ? "Update" : "Submit"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NormalUserLanding;
