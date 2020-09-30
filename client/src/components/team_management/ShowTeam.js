import React, { Fragment, useState, useEffect } from "react";

//components
import EditTeamMember from "./EditTeamMember";

// component to show all the team members in the db
const ShowTeam = ({ allTeamMembers, setTeamChange }) => {
  const [team, setTeamMembers] = useState([]); // assigned to an empty array

  // function to set team member to inactive.
  const deleteTeamMember = async (id) => {
    try {
      await fetch(`/routes/teammanagement/delete/${id}`, {
        method: "PUT",
        headers: { token: localStorage.token },
      });

      setTeamMembers(team.filter((app_user) => app_user.user_id !== id));
    } catch (err) {
      console.error(err.message);
    }
    setTeamChange(true);
  };

  useEffect(() => {}, []);

  return (
    <Fragment>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {}
          {allTeamMembers.map((app_user) => (
            <tr key={app_user.user_id}>
              <td>{app_user.user_name}</td>
              <td>{app_user.role}</td>
              <td>
                <EditTeamMember
                  member={app_user}
                  setTeamChange={setTeamChange}
                />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTeamMember(app_user.user_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ShowTeam;
