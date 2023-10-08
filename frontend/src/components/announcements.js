import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import  './announcements_styles.css';
function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showform,setshowform]=useState(false);
  const [isformUploading,setIsformUploading]=useState(false);
  const [currentcategory,setcurrentcategory]=useState('all');
  const [showfilterform,setshowfilterform]=useState(false);
  const [selectedfilterdate,setselectedfilterdate]=useState('');
  const location = useLocation();
  const userstate = location.state;
  const userdata=userstate.userData;

  useEffect(() => {
    async function getAnnouncements() {
      setIsLoading(true);
  
      try {
        const response = await axios.get('http://localhost:8004/api/announcements', {});
        var respdata=response.data;
        respdata=respdata.filter((user)=>user.pincode===userdata.pincode)
       if(currentcategory!='sortbydate'){ respdata.sort((a, b) => {
          // Convert the createdAt values to Date objects for comparison
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
        
          // Compare the dates in reverse order (descending)
          return dateB - dateA;
        });
      }
      if(currentcategory==='today'){
        const currentDate = new Date();

// Filter the announcements created today
 respdata = respdata.filter((announcement) => {
  const createdAtDate = new Date(announcement.createdAt);

  // Compare the year, month, and day of the createdAtDate with currentDate
  return (
    createdAtDate.getDate() === currentDate.getDate() &&
    createdAtDate.getMonth() === currentDate.getMonth() &&
    createdAtDate.getFullYear() === currentDate.getFullYear()
  );
});

      }
      if(currentcategory==='aftercertain date'){
//console.log(selectedfilterdate);
        const filterDate = new Date(selectedfilterdate);
        respdata = respdata.filter((announcement) => {
          const createdAtDate = new Date(announcement.createdAt);
          return createdAtDate >= filterDate;
        });

       // setselectedfilterdate('');
      }
        setAnnouncements(respdata); // Update state with response data
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getAnnouncements();
  }, [isformUploading,currentcategory,selectedfilterdate]);
  useEffect(()=>{
 if(isLoading===false) setIsformUploading(isLoading);
  },[isLoading])

  return (
    <div className='entireannc'>
    <div className='body-annc'>
      {/* <h1>userdata in announcement is {userdata.email}</h1> */}
      <Header showform={showform} setshowform={setshowform} />
      {showform?(<NewAnnouncementForm setAnnouncements={setAnnouncements} userdata={userdata} setshowform={setshowform} setIsLoading={setIsLoading} setIsformUploading={setIsformUploading}/>):null}
      <main className='main-annc'>

        <CategoryFilter setcurrentcategory={setcurrentcategory} setshowfilterform={setshowfilterform} showfilterform={showfilterform} setselectedfilterdate={setselectedfilterdate}/>
      {isLoading ? <LoadingPage /> : <ShowAnnouncements annData={announcements} setAnnouncements={setAnnouncements} setIsLoading={setIsLoading} setIsformUploading={setIsformUploading} />}

      </main>
    </div>
    </div>
  );
}function Header({ showform, setshowform }) {
  const appTitle = 'ANNOUNCEMENTS';

  return (
    <header className='header-annc'>
      <div className='logo-annc'>
        <img src='https://tse1.mm.bing.net/th?id=OIP.fBqF8Upvh5hMgBWq0LUsWAHaHx&pid=Api&P=0&h=180' height='68' width='68' alt='Today I Learned Logo' />
        <h1>{appTitle}</h1>
      </div>

      <button
        className='btn-annc btn-large-annc btn-open-annc'
        onClick={() => setshowform((show) => !show)}
      >
        {showform ? 'Close' : 'Post'}
      </button>
    </header>
  );
}
const CATEGORIES = [
  { name: 'sortbydate', color: '#5B0888' },
  { name: 'today', color: '#16a34a' },
  // { name: 'aftercertain date', color: '#ef4444' },
 
];

function NewAnnouncementForm({ setAnnouncements,setIsLoading,setIsformUploading,userdata}) {
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

    if (text &&  textLength <= 400) {
      setIsLoading(true);
      
      const NewAnnouncement = createNewAnnouncement();

     async function posttoapi() {
     // console.log("sending post req to announcements");
     await axios.post("http://localhost:8004/api/announcements", { announcement: text, pincode: userdata.pincode });

      }
      posttoapi();
     setIsformUploading(true);
      setText('');
     
     

      
    }
  }

  return (
    <form onSubmit={handleSubmit} className='fact-form-annc'>
      <input
        type='text'
        placeholder='Share an announcement with the community...'
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{400 - textLength}</span>
      
     
      <button className='btn-annc btn-large-annc' >
        Post
      </button>
    </form>
  );
}
function CategoryFilter({ setcurrentcategory,setshowfilterform,showfilterform,setselectedfilterdate }) {
  return (
    <aside>
      <ul className='categorylist'>
        <li className='category-annc'>
          <button
            className='btn-annc btn-all-categories-annc'
            onClick={() => { setcurrentcategory('all') }}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className='category-annc'>
            <button
              className='btn-annc btn-category-annc'
              style={{ backgroundColor: cat.color }}
              onClick={() => setcurrentcategory(cat.name) }
            >
              {cat.name}
              
            </button>
           
            {/* {(cat.name=='aftercertain date' && showfilterform==true)?<Filterform />:null} */}
          </li>
        ))}
        <li>
        <button
              className='btn-annc btn-category-annc'
              style={{ backgroundColor: '#ef4444' }}
              onClick={() =>{ setshowfilterform((showfilterform)=>!showfilterform);} }
            >
              aftercertain date
              
            </button>
           { showfilterform?<Filterform setcurrentcategory={setcurrentcategory} setshowfilterform={setshowfilterform} setselectedfilterdate={setselectedfilterdate} />:null}
        </li>
      </ul>
    </aside>
  );
}
function Filterform({setcurrentcategory,setshowfilterform,setselectedfilterdate}){
  const [selectedDate, setSelectedDate] = useState('');
  // const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  // const [allAnnouncements, setAllAnnouncements] = useState([]); // Assuming you have an array of all announcements

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // const filterAnnouncements = () => {
  //   const selectedDateObj = new Date(selectedDate);

  //   const filteredAnnouncements = allAnnouncements.filter((announcement) => {
  //     const createdAtDate = new Date(announcement.createdAt);

  //     // Compare the "createdAt" date with the selectedDate, including equality
  //     return createdAtDate >= selectedDateObj;
  //   });

  //   // Update the state with the filtered announcements
  //   setFilteredAnnouncements(filteredAnnouncements);
  // };
const handlefilterSubmit=()=>{
  const selectedDateObj=new Date(selectedDate);
  setshowfilterform(false);
  setselectedfilterdate(selectedDateObj);
  setcurrentcategory('aftercertain date');

}
  return (
    <div>
      <label htmlFor="datePicker" className='datepicker-label-annc'>Select a Date:</label>
      <input type="date" id="datePicker" value={selectedDate} onChange={handleDateChange} className='date-picker-annc'/>
      <button onClick={handlefilterSubmit } className='filter-submit-annc'>Filter</button>
    </div>
  );


}
function ShowAnnouncements(props) {
  const announcementData = props.annData;
  const setAnnouncements=props.setAnnouncements;
  const [date, setDate] = useState('');
  
  return (
    <div>
    
   
    <ul className='facts-list-annc'>
      {announcementData.map((x) => (
       <Announcement key={x._id} announcement={x} announcements={announcementData} setAnnouncements={setAnnouncements} />
      ))}
    </ul>
    </div>
  );
}
function Announcement({ announcement, announcements, setAnnouncements }) {
  const [isUpdating, setIsUpdating] = useState(false);
  if (announcements.length === 0)
    return (
      <p className='message-annc'>
        No facts for this category yet! Create the first one ✌️
      </p>
    );


  return (
    <li className='fact-annc'>
      <p>
       
        {announcement.announcement} 
       
      </p>
      <span
        className='tag-annc'
        style={{
          backgroundColor:'#1b2739',
        }}
      >
       -posted  on {new Date(announcement.createdAt).toLocaleDateString()}
      </span>
     
    </li>
  );
}
function LoadingPage() {
  return <h1>Page is loading</h1>;
}

export default Announcements;
