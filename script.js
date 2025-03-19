require("dotenv").config();

const robloxworker = process.env.ROBLOXWORKER_URL;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const input = document.querySelector("input");
  const button = document.querySelector("button");
  const resultContainer = document.getElementById("result");
  const heading = document.querySelector("h1");

  // Function to trigger the search when the button is clicked
  window.searchRobloxUser = async function () {
    const username = document.getElementById("username").value;
    if (!username) {
      // Alert if the username field is empty
      alert("Please enter a Roblox username.");
      return;
    }

    try {
      const response = await fetch(
        ROBLOXWORKER_URL + `?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      // Log the response to help debug
      console.log("API Response:", data);

      // Check if data and data.data exist and are not empty
      if (
        data &&
        data.data &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        // Look for an exact match in the response
        const user = data.data[0];

        // Only proceed if the user name matches exactly (case-insensitive)
        if (user.name.toLowerCase() === username.toLowerCase()) {
          // Fetch user avatar
          const avatarResponse = await fetch(
            `https://test.cors.workers.dev/?https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=352x352&format=Png`
          );
          const avatarData = await avatarResponse.json();

          // Check if avatar data is available
          if (avatarData && avatarData.data && avatarData.data.length > 0) {
            const avatarUrl = avatarData.data[0].imageUrl;

            resultContainer.innerHTML = `
                            <h2>Username: ${user.name}</h2>
                            <p>Display Name: ${user.displayName}</p>
                            <img src="${avatarUrl}" alt="${user.name}'s avatar">
                            <h6>Right click -> Copy image</h6>
                        `;
            resultContainer.style.display = "block";
          } else {
            resultContainer.innerHTML = `<p>Avatar not found for user "${username}".</p>`;
            resultContainer.style.display = "block";
          }
        } else {
          // If the username does not match exactly, show an alert
          alert(`No exact match found for the username "${username}".`);
        }
      } else {
        // If no users are found, show an alert
        alert(`No user found with the username "${username}".`);
      }
    } catch (error) {
      console.error("Error fetching Roblox user data:", error);
      alert("Error fetching user data. Please try again later.");
    }
  };
});
