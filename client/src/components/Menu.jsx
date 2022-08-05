import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate, Link} from 'react-router-dom';


const Menu = () => {

    let [loggedInUser, setLoggedInUser] = useState({})
    let [allUsers, setAllUsers] = useState([])
    let [search, setSearch] = useState("")
    let [friendList, setFriendList] = useState([])
    let [comment, setComment] = useState({})
    let [postId, setPostId] = useState({})
    let [currPost, setCurrPost] = useState([])

    const [isPopup, setIsPopup] = useState(false)
    const [isViewPopup, setIsViewPopup] = useState(false)
    const [seePosts, setSeePosts] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/getloggedinuser", {withCredentials: true})
            .then(res =>{
                console.log(res)
                if(res.data.results){
                    setLoggedInUser(res.data.results)
                } 
            })
            .catch(err=>{
                console.log(err.response.data)
                navigate("/")
            })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8000/api/users")
            .then(res =>{
                console.log(res)
                if(res.data.results){
                    setAllUsers(res.data.results)
                } 
            })
            .catch(err=>{
                console.log(err)
                navigate("/")
            })
            // eslint-disable-next-line
    }, [])

    const getFriends = () => {
        for (const friend of loggedInUser.friends){
            axios.get(`http://localhost:8000/api/users/get/${friend}`)
                .then(res => {
                    console.log(res)
                    if (res.data.results !== undefined ){
                        setFriendList(friendArr => [...friendArr, res.data.results])    
                    } 
                })
                .catch(err =>{
                    console.log(err)
                })
        }
        setSeePosts(true)
        
    }

    const commentHandler = (event) => {
        setComment(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    const popup = (id) => {
        setPostId({
            _id: id
        })
        setIsPopup(true)
    }

    const viewPopup = (id) => {
        
        console.log(id)
        axios.get(`http://localhost:8000/api/posts/${id}`)
            .then(res => {
                console.log(res)
                setCurrPost(res.data.results.comments)
            })
            .catch(err => {
                console.log(err)
            })
        setIsViewPopup(true)
    }

    const submitComment = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:8000/api/posts/${postId._id}/comments`, comment)
            .then(response => {
                console.log(response)
            })
            .catch(err=>console.log(err));
        setIsPopup(false)
    }

    const closeComment = () => {
        setIsPopup(false)
    }

    const closeViewComment = () => {
        setIsViewPopup(false)
    }

    const searching = (e) => {
        setSearch(e.target.value)
    }

    return (
        <div className="bg-image menu-bg">
            <div className='d-flex justify-content-center'>
                <img src={loggedInUser.profilePicture} alt="" className='rounded-circle med-img-menu' />
                <h1 className='menu-name'>{loggedInUser.firstName} {loggedInUser.lastName}</h1>
            </div>
            <div>
                
            </div>

            <div className="box">
                <input type="text" placeholder="Search for people.." onChange={searching} className="search-bar" />
                <i className="fa fa-search search-icon"></i>
            </div>
            
            {
                allUsers.map(user => {
                    return(
                        <div key={user._id}>
                            {search === user.firstName || search === user.lastName || search === user.firstName + " " + user.lastName ? (
                                <div className='d-flex justify-content-center spacing'>
                                    <img src={user.profilePicture} alt="" className="med-img rounded-circle " />
                                    <Link to={`/profile/${user._id}`}  className='profile-name'><h1>{user.firstName} {user.lastName}</h1></Link>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>)
                })
            }

            { !seePosts ? (<button onClick={getFriends} className="btn btn-warning">See your friend's posts</button>) : <></>}
            
            
            { seePosts ? (
                friendList.map(friend => {
                    return(
                        friend.posts.map(post =>{
                            return (
                                <div className='d-flex justify-content-center'>
                                <div className='post'>
                                    <div className='d-flex'>
                                        <img src={friend.profilePicture} alt="" className="med-img rounded-circle " />
                                        <Link to={`/profile/${friend._id}`} className="post-profile-name"><p>{friend.firstName} {friend.lastName}</p></Link>
                                    </div>
                                    <hr />
                                    <h1 className='post-caption'>{post.caption}</h1>
                                    <img src={post.imgUrl} alt="" className='post-image' />
                                    <button className='mt-3 btn btn-warning' onClick={() => viewPopup(post._id)}>View Comments</button>
                                    <hr></hr>
                                    <button onClick={() => popup(post._id)} className="btn btn-primary">Add Comment</button>
                                </div>
                                </div>
                            )
                        })
                    )
                }) ) : ( <></>)
            }

                { isPopup ?
                    (<div className='popup-comment'>
                        <div className='popup-content-comment'>
                            <div className="form-control ">
                                <input type="text" name="comment" placeholder='Comment here' onChange={commentHandler} />
                            </div>
                            <button className='btn btn-warning mt-4' onClick={submitComment}>Comment</button>
                            <button className='btn btn-info mt-4' onClick={closeComment}>Close</button>
                        </div>
                    </div>) : (
                        <br />
                    )
                }   

                { isViewPopup ?
                    (<div className='popup-comment'>
                        <div className='popup-content-comment'>
                            {
                                currPost.map(comment => {
                                    return(
                                    <h1>{comment}</h1>
                                    )
                                })
                            }
                            <button className='btn btn-info mt-4' onClick={closeViewComment}>Close</button>
                        </div>
                    </div>) : (
                        <br />
                    )
                }   

            
        
        </div>
    );
};

export default Menu;