import React, { useState, useEffect } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';
import LoginButton from './components/Loginbutton';
import Profile from './components/Profile';  
import Login from './components/Login';
import './components/Login.css';


const App = () => {
  const useDummyData = true; // use dummydata or not
  const [activeMenu, setActiveMenu] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const [petPosition, setPetPosition] = useState({
    x: window.innerWidth / 2 - 50,
    y: window.innerHeight / 2 - 50,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login or not
  const [showPopup, setShowPopup] = useState(false);  // 

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 });
  const [userName, setUserName] = useState("")
  const [status, setStatus] = useState({});
  // ! status = {
  // !            health : number,
  // !            hunger : [number, time()], 
  // !            mood: [number, time()]
  // !          } 

  // ! key === "health" ? value : value[0] 

  const [petAction, setPetAction] = useState('dorodash');
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Track whether the menu is visible
  const [isSubMenuHovered, setIsSubMenuHovered] = useState(false); // Track whether the submenu is being hovered
  const [notificationMessage, setNotificationMessage] = useState(''); // 
  const [isIdleMode, setIsIdleMode] = useState(true); // 
  const [hungerMoodSuperscore, setHungerMoodSuperscore] = useState(0);
  // health = f(hunger, mood)

  const getPetStatus = async() => {

    const requestBody = {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/pet-details?user_name=${userName}`, requestBody);
      console.log(response)
      const res = await response.json();
      // If not 200-response-code
      if (!response.ok) { 
          throw new Error(`${response.status}`)
      }
      
      // Successfully fetched pet details!
      console.log(res.message);

      // Convert date-string inside hunger/mood arrays to a JS-'Date' object
      res.petDetails.hunger[1] = new Date(res.petDetails.hunger[1]);
      res.petDetails.mood[1] = new Date(res.petDetails.mood[1]);

      // Return result
      return res.petDetails;

    } catch(error) {
      console.error(error)
    } 

  }

  const getHealth = async () => {
    
    const requestBody = {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/pet-health?user_name=${userName}`, requestBody);
      console.log(response)
      const res = await response.json();
      // If not 200-response-code
      if (!response.ok) { 
          throw new Error(`${response.status}`)
      }
      
      // Successfully fetched pet details!
      console.log(res.message);
      return res.health; // ADT Best-Practices | getters only return values, not set / update them. That's for setters (update) / after code-logic...


    } catch(error) {
      console.error(error)
    } 

  }
  
  const getHunger = async () => {

    const requestBody = {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/pet-hunger?user_name=${userName}`, requestBody);
      const res = await response.json();
      // If not 200-response-code
      if (!response.ok) { 
          throw new Error(`${response.status}`)
      }
      
      // Successfully fetched pet hunger!
      console.log(res.message);
      return res.hunger; // ADT Best-Practices | getters only return values, not set / update them. That's for setters (update) / after code-logic...

    } catch(error) {
      console.error(error)
    } 

  }

  const getMood = async () => {

    const requestBody = {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/pet-mood?user_name=${userName}`, requestBody);
      console.log(response)
      const res = await response.json();
      // If not 200-response-code
      if (!response.ok) { 
          throw new Error(`${response.status}`)
      }
      
      // Successfully fetched pet details!
      console.log(res.message);
      return res.mood; // ADT Best-Practices | getters only return values, not set / update them. That's for setters (update) / after code-logic...

    } catch(error) {
      console.error(error)
    } 

  }

  const updateHealth = async () => {

      // ! NOTE: Doing await getHunger()[0] is undefined[0] (b/c await doesn't apply to keying the ASYNCHRONOUS function)
      const hunger = await getHunger();
      const mood = await getMood();
      // Await to actually wait for the async-api-call to return a value for mood, hunger (else, undefined)

      // Only update health if hunger, mood return defined values | else undefined === error
      if (hunger !== undefined && mood !== undefined) {
        const newHealth = Math.floor(100 * ((mood[0] + (100 - hunger[0])) / (100 + 100)));

        const requestBody = {
          method: 'PATCH',
          headers: {
          'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({newHealth: newHealth})
          // Max_mood == 100 
          // Max-hunger = 100 (higher hunger means higher health via 100 - status.hunger inversely-proportional relationship...)
          // Either fed (click feed | decrease hunger levels), or pet hasn't been fed in 30s -> increase hunger levels
          // body: JSON.stringify({newHealth: 70})
        }
    
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userName}/update-pet-health`, requestBody);
          console.log(response)
          const res = await response.json();
          // If not 200-response-code
          if (!response.ok) { 
              throw new Error(`${response.status}`)
          } 
          
          // Successfully updated pet health!
          console.log(res.message);
    
        } catch(error) {
          console.error(error)
        } 
      }
  
  
    }

  // Each time pet is fed, update hunger (-10 for lower meaning less hungry (i.e. better | less is more))
  // Else, if pet hasn't been fed in 30s, increase hunger levels
  const updateHunger = async(fed) => {

    const newHunger = fed ? Math.max((status.hunger[0]) - 10, 0) : Math.min((status.hunger[0]) + 10, 100);

    const requestBody = {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({newHunger: newHunger})
      // Either fed (click feed | decrease hunger levels), or pet hasn't been fed in 30s -> increase hunger levels
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userName}/update-pet-hunger`, requestBody);
      console.log(response)
      const res = await response.json();
      // If not 200-response-code
      if (!response.ok) { 
          throw new Error(`${response.status}`)
      }
      
      // Successfully fed pet!
      console.log(res.message);
      setNotificationMessage(`Hunger ${fed ? "decreased" : "increased"} to ${newHunger}%`);


    } catch(error) {
      console.error(error)
    } 


  }

    // Decrease mood every 'x' seconds pet is not played with (i.e. interacted with)
    // ! Mood = f(play)
    const updateMood = async(playedWith) => {

      const newMood = playedWith ? Math.min((status.mood[0]) + 10, 100) : Math.max((status.mood[0]) - 10, 0);
  
      const requestBody = {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({"newMood": newMood})
        // Either interacted with (click play | increase mood levels), or pet hasn't been played with in 30s -> decrease mood levels (from 100 to '-10', bounded towards 0)
      }
  
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userName}/update-pet-mood`, requestBody);
        console.log(response)
        const res = await response.json();
        // If not 200-response-code
        if (!response.ok) { 
            throw new Error(`${response.status}`)
        }
        
        // Successfully updated pet-mood (via petting it or playing with it)
        console.log(res.message);
        setNotificationMessage(`Mood ${playedWith ? "increased" : "decreased"} to ${(newMood)}%`);
  
      } catch(error) {
        console.error(error)
      }   

    }


  // ! Set initial status of pet (i.e. values in database for 'health, hunger, mood')
  useEffect(() => {

    // Skip initial render
    if (userName !== "") {

      // Multiple CHAINED (i.e. Dependent) Async requests / APIs called, so call together in new async function :)
      const setInitialDetails = async () => {

        // Set initial pet-status 
        const newStatus = await getPetStatus(); // Getter [return desired value]
        setStatus(newStatus); // Setter [modify from desired value]
      }

      // Call function :)
      setInitialDetails();
    }

  }, [isLoggedIn])

  // Display notification message after interacting with pet (feed, pet/play)
  useEffect(() => {

    // Skip initial render (i.e. setting notificationMessage initially)
    if (notificationMessage !== '') { 

      // Display notification for 2 seconds only, before resetting it
      const timeoutID = setTimeout(() => setNotificationMessage(''), 2000);

      // Cleanup function to prevent 'timeout-stacking'
      return () => clearTimeout(timeoutID);
    }

  },[notificationMessage])

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu);
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const updatePetPosition = (newPosition) => {
    if (!isIdleMode) {
      setPetPosition(newPosition);
    }
  };

  // Call API-functions
  const feedPet = async () => {

    await updateHunger(true); 
    await updateHealth();
    const newStatus = await getPetStatus(); // Getter [return desired value]
    setStatus(newStatus); // Setter [update/modify/MUTATE from desired value]
  }

  const petOrPlayWithPet = async () => {

    await updateMood(true); 
    await updateHealth();
    const newStatus = await getPetStatus(); // Getter [return desired value]
    setStatus(newStatus); // Setter [update/modify/MUTATE from desired value]
  }

  const handleOptionClick = (option) => {
    console.log('Option clicked:', option); // 

    switch (option) {
      // Decrease hunger levels towards 0 (i.e. not hungry/thirsty)
      case 'Feed':
        feedPet();
        break;

      // Increase Mood from user interacting with the pet
      case 'Play':
        petOrPlayWithPet()
        break;

      // Increase Mood from user interacting with the pet
      case 'Pet':
        petOrPlayWithPet();
        break;

      case 'Idle Mode':
        if (isIdleMode) {
          setIsIdleMode(false);
          setNotificationMessage('Pet is now out of Idle Mode, movement resumed.');
          // actionMessage = 'Pet is now out of Idle Mode, movement resumed.';
        } else {
          setIsIdleMode(true);
          // actionMessage = 'Pet is now in Idle Mode, movement stopped.';
          setNotificationMessage('Pet is now in Idle Mode, movement stopped.');
        }
        break;
      case 'Reset Status':
        setStatus({
          Health: 100, // 100
          Hunger: 0, // 0 [10(0) === Hungry]
          Mood: 100, // 10(0)
        });
        setNotificationMessage('Pet status has been reset to zero.');
        break;
      default:
        console.log(`Unknown option: ${option}`);
    }
  };

  useEffect(() => {
    console.log(userName);
  }, [userName]);

  return (

    !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} username={userName} setUsername={setUserName}/> : (
      <div>
        <div
          onMouseEnter={() => setIsMenuVisible(true)} // Show menu when mouse enters pet area
          onMouseLeave={() => {
            if (!isSubMenuHovered) {
              setIsMenuVisible(false); // Hide menu only if submenu is not being hovered
            }
          }}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          {/* Pet Component */}
          <Pet position={petPosition} onPositionChange={updatePetPosition} action={petAction} />

          {/* Menu Bar - only visible when mouse is over the pet */}
          {isMenuVisible && (
            <MenuBar
              petPosition={petPosition}
              onMenuClick={handleMenuClick}
              onSubMenuPositionChange={setSubMenuPosition}
            />
          )}

          {/* Notification for interactions */}
          { notificationMessage !== '' && (
                <div
                style={{
                  position: 'absolute',
                  top: petPosition.y - 70, // 
                  left: petPosition.x,
                  transform: 'translate(-50%, 0)',
                  background: 'rgba(0, 0, 0, 0.75)', // 
                  color: '#fff', // white
                  padding: '10px 20px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  zIndex: 1000,
                  fontSize: '14px',
                  textAlign: 'center',
                  width: 'max-content', // 
                }}
              >
                {notificationMessage}
              </div>
            )
          }
        </div>

        {/* Sub Menu */}
        {/* key === "health" ? value : value[0] | status = {health : number, hunger : [number, time()], mood: [number, time()]} */}
        <SubMenu
          activeMenu={activeMenu}
          position={{ x: petPosition.x + 10, y: petPosition.y + 170 }} // submenu position
          status={status}
          onOptionClick={handleOptionClick}
          onClose={handleMenuClose}
          onMouseEnter={() => setIsSubMenuHovered(true)} // Mark submenu as hovered
          onMouseLeave={() => setIsSubMenuHovered(false)} // Mark submenu as not hovered
        />

          <LoginButton/>
      </div>
    )
  );
};

export default App;
