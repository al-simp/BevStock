import React, { useState, useEffect } from "react";
import ShowTeam from "./ShowTeam";
import AddTeamMember from "./AddTeamMember";

//components

const TeamManagement = () => {
    const [allTeamMembers, setTeamMembers] = useState([]);
    const [teamChange, setTeamChange] = useState(false);

    const getTeam = async () => {
        try {
            const response = await fetch("http://localhost:5000/teammanagement/", {
                method: "GET",
                headers: { token: localStorage.token },
            });

            const parseData = await response.json();

            setTeamMembers(parseData);

        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
      getTeam();
      setTeamChange(false)
    }, [teamChange]);

    return (
        <main role="main">
          <div className="jumbotron">
            <div className="container">
              <h1 className="display-3">Team Management</h1>
              <AddTeamMember setTeamChange={setTeamChange}/>
            </div>
            
          </div>
          <div>
            <ShowTeam allTeamMembers={allTeamMembers} setTeamChange={setTeamChange} />
          </div>
        </main>
      );
    };
    
    export default TeamManagement;
    

