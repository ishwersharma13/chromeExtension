import React, { useEffect, useState } from 'react';

function App() {
  const [location, setLocation] = useState<{ country: string; city: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ipifyApiUrl = process.env.REACT_APP_IPIFY_API_URL || '';
  const ipinfoAccessToken = process.env.REACT_APP_IPINFO_ACCESS_TOKEN || '';
  const ipinfoApiUrl = process.env.REACT_APP_IPINFO_API_URL || '';

  const fetchIpAddress = async () => {
    try {
      const response = await fetch(ipifyApiUrl);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchIpAddress()
      .then((ip) => {
        if (ip) {
          fetch(`${ipinfoApiUrl}/${ip}/json?token=${ipinfoAccessToken}`)
            .then((response) => response.json())
            .then((data) => {
              const country = data.country;
              const city = data.city;
              setLocation({ country, city });
            })
            .catch((error) => {
              console.error('Error fetching user location:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
      });
  }, []);

  const handleShowLocationClick = () => {
    setIsLoading(true);

    // Fetch user's IP address from ipify API
    fetch(ipifyApiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Use the fetched IP address to make the IPinfo API request
        const userIp = data.ip;
        return fetch(`${ipinfoApiUrl}/${userIp}/json?token=${ipinfoAccessToken}`);
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the fetched location data
        const country = data.country;
        const city = data.city;
        setLocation({ country, city });
      })
      .catch((error) => {
        console.error('Error fetching user location:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="popup-container bg-gray-100 p-4 rounded-md shadow-md">
      <div className="popup-content text-center p-4">
        {location ? (
          <div>
            <p className="text-lg font-semibold">Your Location:</p>
            <p>Country: {location.country}</p>
            <p>City: {location.city}</p>
          </div>
        ) : (
          <button
            className={`popup-button bg-blue-500 text-white px-4 py-2 rounded-md ${
              isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
            }`}
            onClick={handleShowLocationClick}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Show my location'}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
