import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const EditTeamMember = ({ member, setTeamChange }) => {


  const [name, setName] = useState(member.user_name);
  const [email, setEmail] = useState(member.user_email);
  
  const setDetails = (username, email) => {
    setName(username);
    setEmail(email)
  }

  const editDetails = async id => {
    try {
      const body = { name, email };

      

      const myHeaders = new Headers();


      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      await fetch(`http://localhost:5000/teammanagement/update/${id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      toast.success("Details updated successfully!")

      setTeamChange(true);
      
    } catch (err) {
      console.log(err.message);
    }
  };
  

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${member.user_id}`}
      >
        Edit
      </button>
      {}
      <div
        className="modal"
        id={`id${member.user_id}`}
        onClick={() => () => setEmail(member.user_email)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Details</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setDetails(member.user_name, member.user_email)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                className="form-control mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={e => editDetails(member.user_id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setDetails(member.user_email, member.user_name)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditTeamMember;
