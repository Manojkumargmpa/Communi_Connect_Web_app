import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts(){
    const [posts, setPosts] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
   const [isformUploading,setisformUploading]=useState(false);

    useEffect(() => {
      
        async function getPosts() {
          try {
            setShouldFetch(true);
            const response = await axios.get('http://localhost:8004/api/posts', {});
           // console.log(response.data);
            setPosts(response.data);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }finally{
            setShouldFetch(false);
          }
        
        
        
    }
    getPosts();
        
      },[isformUploading]);

      useEffect(()=>{
        if(shouldFetch==false) setisformUploading(shouldFetch);
         },[shouldFetch]);
       
    return(
<>
<ShowAnnouncements annData={posts} setShouldFetch={setShouldFetch} setisformUploading={setisformUploading}/>
</>  
)
}

function NewAnnouncementForm({setShouldFetch,setisformUploading}) {
    const [user_name, setUsername] = useState('');
    const [contents, setPost] = useState('');
    const [image,setImage] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        const formData=new FormData();
       
        formData.append("username", user_name);
        formData.append("content", contents);
        formData.append("avatar",image);
    
     
        async function posttoapi() {
          try {
           
            
        
            // Add other data to the formData object
           
            // Send the formData with the POST request
            const response = await axios.post("http://localhost:8004/api/posts", formData, {
              headers: {
                "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data for file uploads
              },
            });
        
            console.log("Response:", response.data);
          } catch (error) {
            console.error("Error:", error);
          }
        }
        
          setisformUploading(true);
          posttoapi();
         
      } 
    function onimginputchange(e){
      console.log(e.target.files[0]);
      setImage(e.target.files[0]);
      

    };
    return (
<form onSubmit={handleSubmit}>
<div className="mb-3">
    <label htmlFor="email" >
        <strong>UserName</strong>
    </label>
    <input
        type="text"
        placeholder="Enter UserName"
        autoComplete="off"
        name="email"
        className="form-control rounded-10"
        
        onChange={(e) => setUsername(e.target.value)}
    />
    </div>  
    
    <div className="mb-3">
        <label htmlFor="posts">
            <strong>POST</strong>
        </label>
        <input
            type="text"
            placeholder="Type something..."
            name = "posts"
            className="form-control rounded-10"
            onChange={(e) => setPost(e.target.value)}
        />
    </div>
    <label htmlFor="avatar">Upload Image:</label>
    <input type="file" name="avatar" placeholder='upload Image' onChange={onimginputchange} />
    <button type="submit" className="btn btn-success w-100 rounded-10">
        POST
    </button>
</form>
    );
  }
function ShowAnnouncements(props) {
    const announcementData = props.annData;
    return (
      <div>
      <NewAnnouncementForm setShouldFetch={props.setShouldFetch} setisformUploading={props.setisformUploading}/>
     
      <ul>

        {announcementData && announcementData.map((x) => (
          <li key={x._id}>
            {x.content} - Created at {new Date(x.createdAt).toLocaleString()} 
            -{ x.avatar && <img src={require(`./../images/${x.avatar}`)} alt="Avatar" height={700} width={700} /> }

          </li>
          
        ))}
      </ul>
      </div>
    );
  }
export default Posts;