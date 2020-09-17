import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const AddTeamMember = ({ setTeamChange }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { email, password, name } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    const modal = document.getElementById("myModal");
    e.preventDefault();
    modal.setAttribute("style", "display: none");
    const modalBackdrops = document.getElementsByClassName("modal-backdrop");
    document.body.removeChild(modalBackdrops[0]);

    const userRole = document.getElementById("userrole");
    const role = userRole.value;

    try {
      const body = { email, password, name, role };

      const response = await fetch("http://localhost:5000/teammanagement/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await response.json();

      toast.success("Registered Successfully!");

      setInputs({
        email: "",
        password: "",
        name: "",
      });

      setTeamChange(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-info btn-lg"
        data-toggle="modal"
        data-target="#myModal"
      >
        Add team member
      </button>

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add new team member</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={onSubmitForm}>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="form-control my-3"
                  value={email}
                  onChange={(e) => onChange(e)}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="form-control my-3"
                  value={password}
                  onChange={(e) => onChange(e)}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  className="form-control my-3"
                  value={name}
                  onChange={(e) => onChange(e)}
                />
                <select className="form-control my-3" id="userrole">
                  <option value="User">Bar Staff</option>
                  <option value="Admin">Manager</option>
                </select>
                <button className="btn btn-success btn-block">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddTeamMember;
