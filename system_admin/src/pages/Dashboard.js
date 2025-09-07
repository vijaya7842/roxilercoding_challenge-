import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sweetAlert from "sweetalert2";


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [storeRatingFilter, setStoreRatingFilter] = useState("");
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [activeMenu, setActiveMenu] = useState("User List"); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [numberOFUser, setnumberOFUser] = useState(0);
  const [numberofStore, setnumberofStore] = useState(0);
  const [numberOfRating, setnumberOfRating] = useState(0);
const handelStoreSubmit = async () => {
  const response = await fetch('http://localhost:5000/api/addStore', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(storeForm)
  });

  if (!response.ok) {
    alert("Request failed with status " + response.status);
    return;
  }

  const jsonResponse = await response.json();

  if (jsonResponse.success) {
    sweetAlert.fire({
      text: "Store Added Successfully",
      title: "Store Added",
      icon: 'success',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6'
    }).then(() => {
      setStoreForm({ name: "", email: "", password: "", address: "" });
      fetchStoresList(); 
    });
  } else {
    alert(jsonResponse.msg || 'Something went wrong');
  }
};

  
  const onhandlechange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data,
      [name]: value,
    }));
  };

  
  const onStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreForm((data) => ({
      ...data,
      [name]: value,
    }));
  };


  const handleadduser = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formdata),
    });
    if (!response.ok) {
      alert("Something went wrong, please try again later");
      return;
    }
    const jsonResponse = await response.json();
    if (jsonResponse.success) {
      sweetAlert.fire({
        icon: "success",
        title: "User Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setFormdata({ name: "", email: "", password: "", address: "", role: "" });
      handelOnListOfUser(); 
    }
  };

 
  const handleAddStore = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/addStore", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storeForm),
    });
    if (!response.ok) {
      alert("Something went wrong, please try again later");
      return;
    }
    const jsonResponse = await response.json();
    if (jsonResponse.success) {
      sweetAlert.fire({
        icon: "success",
        title: "Store Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setStoreForm({ name: "", email: "", password: "", address: "" });
      fetchStoresList(); 
      setActiveMenu("Manage Stores"); 
    }
  };

  
  useEffect(() => {
    fetchNumberOfUsers();
    fetchNumberOfStores();
    fetchNumberOFRating();
    handelOnListOfUser();
  }, []);

  const fetchNumberOfUsers = async () => {
    const fetch1 = await fetch("http://localhost:5000/api/userCount", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!fetch1.ok) return;
    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) setnumberOFUser(jsonResponse.usersCount);
  };

  const fetchNumberOFRating = async () => {
    const fetch1 = await fetch("http://localhost:5000/api/getRatingCount", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!fetch1.ok) return;
    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) setnumberOfRating(jsonResponse.ratingCount);
  };

  const fetchNumberOfStores = async () => {
    const fetch1 = await fetch("http://localhost:5000/api/storeCount", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!fetch1.ok) return;
    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) setnumberofStore(jsonResponse.getStoreCount);
  };

  const handelOnListOfUser = async () => {
    const response = await fetch("http://localhost:5000/api/listOfUsers", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return;
    const jsonResponse = await response.json();
    if (jsonResponse.success) setUsers(jsonResponse.users);
  };

  const fetchStoresList = async () => {
    const response = await fetch("http://localhost:5000/api/getStores", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return;
    const jsonResponse = await response.json();
    if (jsonResponse.success) setStoreList(jsonResponse.stores);
  };

  const logout = async () => {
    sweetAlert
      .fire({
        title: "Are you sure?",
        text: "You will be logged out",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes Logout",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.address?.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "" || u.role === roleFilter)
  );

  const filteredStores = storeList.filter(
    (s) =>
      (s.name?.toLowerCase().includes(storeSearch.toLowerCase()) ||
        s.email?.toLowerCase().includes(storeSearch.toLowerCase()) ||
        s.address?.toLowerCase().includes(storeSearch.toLowerCase())) &&
      (storeRatingFilter === "" || String(s.rating) === storeRatingFilter)
  );

  
  const SidebarItem = ({ name, icon }) => {
    const isActive = activeMenu === name;

    return (
      <li className="nav-item mb-2">
        <button
          className={`nav-link text-start w-100 ${isActive ? "active" : ""}`}
          onClick={() => {
            if (name === "Logout") logout();
            else {
              setActiveMenu(name);
              if (name === "Manage Stores") fetchStoresList();
            }
          }}
        >
          <i className={`bi ${icon} me-2 text-dark`}></i> {name}
        </button>
      </li>
    );
  };

  return (
    <div className="container-fluid p-0">
      <div className="row">
      
        <div className="col-md-2 bg-light vh-100 p-3 border-end">
          <h5 className="mb-4">System Administrator</h5>
          <ul className="nav flex-column">
            <SidebarItem name="User List" icon="bi-people" />
            <SidebarItem name="Manage Stores" icon="bi-shop" />
            <SidebarItem name="Add User" icon="bi-person-plus" />
            <SidebarItem name="Add Store" icon="bi-plus-square" />
            <SidebarItem name="Logout" icon="bi-box-arrow-right" />
          </ul>
        </div>

        <div className="col-md-10 p-4">
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Users</h6>
                    <h3>{Number(numberOFUser)}</h3>
                  </div>
                  <i className="bi bi-people fs-2 text-dark"></i>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Stores</h6>
                    <h3>{numberofStore}</h3>
                  </div>
                  <i className="bi bi-shop fs-2 text-dark"></i>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Ratings</h6>
                    <h3>{numberOfRating}</h3>
                  </div>
                  <i className="bi bi-star fs-2 text-dark"></i>
                </div>
              </div>
            </div>
          </div>

          
          {activeMenu === "User List" && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Users List</h5>

               
                <div className="row mb-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, or address..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="systemAdmin">Admin</option>
                      <option value="normalUser">User</option>
                      <option value="storeOwner">Store Owner</option>
                    </select>
                  </div>
                </div>

               
                <div className="table-responsive">
                  <table className="table table-hover table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <tr key={u._id || u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.address}</td>
                            <td>{u.role}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

         
          {activeMenu === "Manage Stores" && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Stores List</h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, or address..."
                      value={storeSearch}
                      onChange={(e) => setStoreSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={storeRatingFilter}
                      onChange={(e) => setStoreRatingFilter(e.target.value)}
                    >
                      <option value="">All Ratings</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

             
                <div className="table-responsive">
                  <table className="table table-hover table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStores.length > 0 ? (
                        filteredStores.map((s) => (
                          <tr key={s._id || s.id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.address}</td>
                            <td>{s.rating}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No stores found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          
          {activeMenu === "Add User" && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Add New User</h5>
                <form onSubmit={handleadduser}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formdata.name}
                      onChange={onhandlechange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formdata.email}
                      onChange={onhandlechange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formdata.password}
                      onChange={onhandlechange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formdata.address}
                      onChange={onhandlechange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formdata.role}
                      onChange={onhandlechange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="systemAdmin">Admin</option>
                      <option value="normalUser">User</option>
                      <option value="storeOwner">Store Owner</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeMenu === "Add Store" && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Add New Store</h5>
                <form onSubmit={handelStoreSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={storeForm.name}
                      onChange={onStoreChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={storeForm.email}
                      onChange={onStoreChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={storeForm.password}
                      onChange={onStoreChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={storeForm.address}
                      onChange={onStoreChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Store
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard
