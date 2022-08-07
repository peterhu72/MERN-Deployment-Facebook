import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';

const FriendProfile = () => {
    let [otherUser, setOtherUser] = useState({})
    let [loggedInUser, setLoggedInUser] = useState({})
    let [friendList, setFriendList] = useState([])
    const [loadingPost, setLoadingPost] = useState(true)
    const [loadingPostOther, setLoadingPostOther] = useState(true)
    const [isFriendsBtn, setIsFriendsBtn] = useState(true)

    const {id} = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/getloggedinuser", {withCredentials: true})
            .then(res =>{
                console.log(res)
                if(res.data.results){
                    setLoggedInUser(res.data.results)
                } 
                setLoadingPostOther(false)
            })
            .catch(err=>{
                console.log(err)
                navigate("/")
            })
            // eslint-disable-next-line
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/get/${id}`, {withCredentials: true})
            .then(res =>{
                console.log(res)
                if(res.data.results){
                    setOtherUser(res.data.results)
                } 
                setLoadingPost(false)
            })
            .catch(err=>{
                console.log(err)
                navigate("/")
            })
            // eslint-disable-next-line
    }, [])

    const addFriend = () => {
        axios.post(`http://localhost:8000/api/users/add/${loggedInUser._id}/${otherUser._id}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getFriends = () => {
        for (const friend of otherUser.friends){
            axios.get(`http://localhost:8000/api/users/get/${friend}`)
                .then(res => {
                    console.log(res)
                    if (res.data.results !== undefined ){
                        setFriendList(arr => [...arr, res.data.results])
                    } 
                    console.log(res.data.results)
                })
                .catch(err =>{
                    console.log(err)
                })
        }
    
        setIsFriendsBtn(false)
    }
    
    const formatDate = (date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString("en-US")
    }
    

    return (
        <div>

            <div className='head-container'>

                { otherUser.coverPicture === "" ? (
                    <img className="image-cover rounded" src="https://theoheartist.com/wp-content/uploads/sites/2/2015/01/fbdefault.png" alt = ""/>
                ) : (
                    <img className="image-cover rounded" src={otherUser.coverPicture} alt="" />
                )
                }


                { otherUser.profilePicture === "" ? (
                    <img className="rounded-circle image-profile text-center" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt = ""/>
                ) : (
                    <img className="rounded-circle image-profile text-center" src={otherUser.profilePicture} alt="" />
                )
                }


                <h1 className='text-center'>{otherUser.firstName} {otherUser.lastName}</h1>

                <div className="d-flex justify-content-evenly" >
                        {otherUser.location === "" ? (<h4>Lives in: Unknown</h4>) : (<h4>Lives in: {otherUser.location}</h4>)}
                        {formatDate(otherUser.birthday) === "11/11/1111" ?(
                            <h4>Birthday: Unknown </h4>
                        ) : (
                        <h4>Birthday: {formatDate(otherUser.birthday)}</h4>
                        )
                        }
                </div>

                <div className="text-center">
                
                    { !loadingPostOther ? (
                        loggedInUser.friends.length !== 0 ? (
                            loggedInUser.friends.includes(otherUser._id) ? <h1>Friends!</h1> : 
                            (<button className='btn btn-info' onClick={addFriend} key={loggedInUser._id}>Add Friend</button>)
                                        
                        ) : ( <button className='btn btn-info' onClick={addFriend}>Add Friend</button>)
                    ) : (
                        <h1>Loading...</h1>
                    )
                    }
                    
                </div>
                {!loadingPost ? (<h3 className='text-center friend-sml'>{otherUser.friends.length} Friends</h3>) : <></>}
                
                
            </div>
            
            <div className='bg-light head-container d-flex'>
                <div className="col">
                    <h1>Friends</h1>
                    { isFriendsBtn ? (<button className="btn btn-info" onClick={getFriends}>See Friends</button>) : (<></>)}
                
                    {
                        !isFriendsBtn ? (
                            otherUser.friends.length !== 0 ? (
                                friendList.map(friend => {
                                    return (
                                        <div key={friend._id} className="d-flex justify-content-center margin-d">
                                            <img src={friend.profilePicture} alt="" className="med-img rounded-circle" />
                                            <Link to={`/profile/${friend._id}`} className="post-profile-name"><h3>{friend.firstName}</h3></Link>
                                        </div>
                                    )
                                })
                            ) : (<h1>No Friends</h1>) 
                        ) : (<></>)
                    }
                </div>
                <div className="col">
                    <h1 className='profile-post-name'>{otherUser.firstName}'s Posts</h1>
                    { !loadingPost ? (
                        otherUser.posts.map(post => {
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

export default FriendProfile;