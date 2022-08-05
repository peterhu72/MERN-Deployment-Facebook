import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate, Link} from 'react-router-dom';

const Profile = () => {

    let [loggedInUser, setLoggedInUser] = useState({})
    let [friendList, setFriendList] = useState([])

    const [image, setImage] = useState({})
    const [profilePictureLoad, setProfilePictureLoad] = useState({})
    const [coverPictureLoad, setCoverPictureLoad] = useState({})
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)
    const [coverLoading, setCoverLoading] = useState(false)
    const [loadingPost, setLoadingPost] = useState(true)
    const [isPopup, setIsPopup] = useState(false)
    const [isPostPopup, setIsPostPopup] = useState(false)
    const [isFriendsBtn, setIsFriendsBtn] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/getloggedinuser", {withCredentials: true})
            .then(res =>{
                console.log(res)
                if(res.data.results){
                    setLoggedInUser(res.data.results)
                } 
                setLoadingPost(false)
            })
            .catch(err=>{
                console.log(err)
                navigate("/")
            })
            // eslint-disable-next-line
    }, [])

    const uploadImage = (e) => {
        console.log("upload image")
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'facebook')
        setLoading(true)
        axios.post('https://api.cloudinary.com/v1_1/dyedz6zps/image/upload', data)
            .then(res => {
                console.log(res)
                setImage({
                    caption: "hello",
                    imgUrl: res.data.url
                })
                setLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
            })
    }

    const postPicture = (e) => {
        console.log("this is image", image)
        e.preventDefault()
        axios.post(`http://localhost:8000/api/users/${loggedInUser._id}/posts`, image)
            .then(res =>{
                console.log(res)
                closePostPopup()
            })
            .catch(err => {
                console.log(err)
            })
    }

    const captionHandler = (e) => {
        setImage({
            ...image,
            [e.target.name]: e.target.value
        })
    }

    const profileHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const uploadProfile = (e) => {
        console.log("upload image")
        const pFiles = e.target.files
        const profileData = new FormData()
        profileData.append('file', pFiles[0])
        profileData.append('upload_preset', 'facebook')
        setProfileLoading(true)
        axios.post('https://api.cloudinary.com/v1_1/dyedz6zps/image/upload', profileData)
            .then(res => {
                console.log(res)
                setProfilePictureLoad({imgUrl: res.data.url})
                console.log(profilePictureLoad)
                axios.put(`http://localhost:8000/api/users/${loggedInUser._id}`, {profilePicture: res.data.url})
                    .then(res => {
                        console.log(res)
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
                setProfileLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setProfileLoading(false)
            })
    }

    const uploadCover = (e) => {
        console.log("upload image")
        const cFiles = e.target.files
        const coverData = new FormData()
        coverData.append('file', cFiles[0])
        coverData.append('upload_preset', 'facebook')
        setCoverLoading(true)
        axios.post('https://api.cloudinary.com/v1_1/dyedz6zps/image/upload', coverData)
            .then(res => {
                console.log(res)
                setCoverPictureLoad({imgUrl: res.data.url})
                axios.put(`http://localhost:8000/api/users/${loggedInUser._id}`, {coverPicture: res.data.url})
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                setCoverLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setCoverLoading(false)
            })
    }

    const popup = () => {
        setIsPopup(true)
    }

    const closePopupForm = () => {
        axios.put(`http://localhost:8000/api/users/${loggedInUser._id}`, form)
            .then(res => {
                console.log(res)
                setIsPopup(false)
            })
            .catch(err => {
                console.log(err)
            })
        
    }

    const getFriends = () => {
        for (const friend of loggedInUser.friends){
            axios.get(`http://localhost:8000/api/users/get/${friend}`)
                .then(res => {
                    console.log(res)
                    if (res.data.results !== undefined ){
                        setFriendList(friendArr => [...friendArr, res.data.results])
                    } 
                    console.log(res.data.results)
                })
                .catch(err =>{
                    console.log(err)
                })
        }
    
        setIsFriendsBtn(false)
    }

    const postPopup = () => {
        setIsPostPopup(true)
    }

    const closePostPopup = () => {
        setIsPostPopup(false)
    }

    const formatDate = (date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString("en-US")
    }
    

    return (
        <div>

            <div className='head-container'>

                { loggedInUser.coverPicture === "" ? (
                    <img className="image-cover rounded" src="https://theoheartist.com/wp-content/uploads/sites/2/2015/01/fbdefault.png" alt = ""/>
                ) : (
                    <img className="image-cover rounded" src={loggedInUser.coverPicture} alt="" />
                )
                }


                { loggedInUser.profilePicture === "" ? (
                    <img className="rounded-circle image-profile text-center" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt = ""/>
                ) : (
                    <img className="rounded-circle image-profile text-center" src={loggedInUser.profilePicture} alt="" />
                )
                }


                <h1 className='text-center'>{loggedInUser.firstName} {loggedInUser.lastName}</h1>
                {!loadingPost ? (<h3 className='text-center'>{loggedInUser.friends.length} Friends</h3>) : <></>}
                

                <div className="d-flex justify-content-evenly">
                    {loggedInUser.location === "" ? (<h4>Lives in: Unknown</h4>) : (<h4>Lives in: {loggedInUser.location}</h4>)}
                    {formatDate(loggedInUser.birthday) === "11/11/1111" ?(
                        <h4>Birthday: Unknown </h4>
                    ) : (
                    <h4>Birthday: {formatDate(loggedInUser.birthday)}</h4>
                    )
                    }
                </div>

                <div className="d-flex justify-content-evenly">
                    <button className='btn btn-info' onClick={popup}>Edit Profile</button>
                    <button className='btn btn-info' onClick={postPopup}>Post</button>
                </div>

                { isPopup ?
                    (<div className='popup'>
                        <div className='popup-content'>
                            <div className="form-control">
                                <label htmlFor="">Edit Profile Picture</label>
                                <input type="file" name="profilePicture" placeholder='Upload an image' onChange={uploadProfile} />
                            </div>
                            {profileLoading ? (
                                <h3>Loading...</h3>
                                ) : (
                                    <img src={profilePictureLoad.imgUrl} style={{ width: '300px' }} alt="" />
                            )}
                            <div className="form-control">
                                <label htmlFor="">Edit Wallpaper</label>
                                <input type="file" name="coverPicture" placeholder='Upload an image' onChange={uploadCover} />
                            </div>
                            {coverLoading ? (
                                <h3>Loading...</h3>
                                ) : (
                                    <img src={coverPictureLoad.imgUrl} style={{ width: '300px' }} alt="" />
                            )}
                            <div className="form-control">
                                <label htmlFor="">Birthday</label>
                                <input type="date" name="birthday" onChange={profileHandler} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="">Lives in</label>
                                <input type="text" name="location" onChange={profileHandler} />
                            </div>
                            <button className='btn btn-primary' onClick={closePopupForm}>Close</button>
                        </div>
                    </div>) : (
                        <br />
                    )
                }   

                { isPostPopup ?
                    (<div className='popup'>
                        <div className='popup-content'>
                            <div className="form-control">
                            <input
                                type="file"
                                name="file"
                                placeholder="Upload an image"
                                onChange={uploadImage}
                                />
                                
                                {loading ? (
                                <h3>Loading...</h3>
                                ) : (
                                    <img src={image.imgUrl} style={{ width: '300px' }} alt="" />
                                )}
                            </div>
                            <div className="form-control">
                                <label htmlFor="">Make a Caption!:</label>
                                <input type="text" name="caption" onChange={captionHandler} />
                            </div>
                            <button className="btn btn-info" onClick={postPicture}>Post</button>
                            <button className='btn btn-primary' onClick={closePostPopup}>Close</button>
                        </div>
                    </div>) : (
                        <br />
                    )
                }  
                
            </div>
            
            <div className='bg-light head-container d-flex'>
                <div className="col">
                    {isFriendsBtn ? (<button onClick={getFriends} className="btn btn-warning">See Friends</button>) : <></>}
                    
                    {
                        !isFriendsBtn ? (
                            loggedInUser.friends.length !== 0 ? (
                                friendList.map(friend => {
                                    return (
                                        <div key={friend._id} className="d-flex justify-content-center margin-d">
                                            <img src={friend.profilePicture} alt="" className="med-img rounded-circle" />
                                            <Link to={`/profile/${friend._id}`} className="post-profile-name"><h3>{friend.firstName} {friend.lastName}</h3></Link>
                                        </div>
                                    )
                                })
                            ) : (<h1>No Friends</h1>) 
                        ) : (<></>)
                    }
                </div>
                <div className="col">
                    <h1 className='profile-post-name'>Your Posts</h1>
                    { !loadingPost ? (
                        
                        loggedInUser.posts.map(post => {
                            return(
                                <div key={post._id} className="post">
                                    <h5 className='post-caption'>{post.caption}</h5>
                                    <img src={post.imgUrl} alt="none" className='post-image'/>
                                </div>
                            )
                        })
                    ) : (<h1>Loading...</h1>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;