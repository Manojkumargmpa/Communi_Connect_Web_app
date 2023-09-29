import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
function Announcements(props) {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isformUploading,setIsformUploading]=useState(false);
  const location = useLocation();
  const userstate = location.state;
  
  const userdata=userstate.userData;

  useEffect(() => {
    async function getAnnouncements() {
      setIsLoading(true);
  
      try {
        const response = await axios.get('http://localhost:8004/api/announcements', {});
        setAnnouncements(response.data); // Update state with response data
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getAnnouncements();
  }, [isformUploading]);
  useEffect(()=>{
 if(isLoading==false) setIsformUploading(isLoading);
  },[isLoading])

  return (
    <div>
      {/* <h1>userdata in announcement is {userdata.email}</h1> */}
      {isLoading ? <LoadingPage /> : <ShowAnnouncements annData={announcements} setAnnouncements={setAnnouncements} setIsLoading={setIsLoading} setIsformUploading={setIsformUploading} />}
    </div>
  );
}

function NewAnnouncementForm({ setAnnouncements,setIsLoading,setIsformUploading}) {
  const [text, setText] = useState('');
 
  
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  function generateRandomId() {
    return Math.round(Math.random() * 10000000);
  }

  function createNewAnnouncement() {
    return {

      announcement:text,
      pincode:456
      

    };
  }

   function handleSubmit(e) {
    e.preventDefault();

    if (text &&  textLength <= 200) {
      setIsLoading(true);
      
      const NewAnnouncement = createNewAnnouncement();

     async function posttoapi() {

        await axios.post("http://localhost:8004/api/announcements", { announcement: text, pincode: 456 });
      }
      posttoapi();
     setIsformUploading(true);
      setText('');
     
     

      
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Share an announcement with the community...'
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      
     
      <button  disabled={isUploading}>
        Post
      </button>
    </form>
  );
}
function ShowAnnouncements(props) {
  const announcementData = props.annData;
  const setAnnouncements=props.setAnnouncements;
  const [date, setDate] = useState('');
  const fetchAnnouncementsfilter = async (type) => {
    try {
      let response;
      if (type === 'date') {
        console.log("tried for fetching after date")
        // Request for announcements after a certain date
        response = await axios.get(`http://localhost:8004/announcements/after/${date}`);
      } else if (type === 'sorted') {
        // Request for announcements sorted by date
        response = await axios.get(`http://localhost:8004/announcements/sorted`);
      }

      setAnnouncements(response.data);
      
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  return (
    <div>
    <NewAnnouncementForm setAnnouncements={props.setAnnouncements} setIsLoading={props.setIsLoading} setIsformUploading={props.setIsformUploading} />
    <input
        type="date"
        value={date}
        onChange={handleDateChange}
      />
      <button onClick={()=>fetchAnnouncementsfilter("date")}>Get Announcements After a Date</button>
      <button onClick={()=>fetchAnnouncementsfilter("sorted")}>Get Announcements in sorted</button>
    <ul>
      {announcementData.map((x) => (
        <li key={x._id}>
          {x.announcement} - Created at {new Date(x.createdAt).toLocaleString() }
        </li>
      ))}
    </ul>
    </div>
  );
}

function LoadingPage() {
  return <h1>Page is loading</h1>;
}

export default Announcements;
