import React, { useState } from 'react'
import "../css/sidebar.css"
import addlogo from "../addfile.png"
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { Modal } from '@mui/material';
import firebase from "firebase";
import { db, storage } from '../firebase';
import { auth } from "../firebase";

function Sidebar(props) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [file, setFile] = useState(null);
    const [modalState, setModalState] = useState(false);
    const [folderName, setFolderName] = useState("");
    const handleClose = () => {
        setOpen(false);
        setModalState(false)
    }
    const handleOpen = () => {
        setOpen(true);
    }
    const openModal = () => {
        setModalState(true);
    }
    const closeModal = () => {
        setModalState(false);
    }
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    const signout = () => {
        auth.signOut().then(() => {
            console.log("user signed out");
        }).catch(error => {
            alert(error.message);
        })
    }
    const handleUpload = (event) => {
        event.preventDefault();
        setUploading(true);
        storage.ref(`Myfiles/${file.name}`).put(file).then(snapshot => {

            storage.ref("Myfiles").child(file.name).getDownloadURL().then(url => {
                db.collection("myfiles").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    filename: file.name,
                    fileURL: url,
                    size: snapshot._delegate.bytesTransferred
                })
                setUploading(false);
                setFile(null);
                setOpen(false);
            })
        })
    }

    const handleCreateFolder = () => {
        setCreating(true);
        setFolderName(folderName);
        console.log(`Folder '${folderName}' was created!`);
        setFolderName("");
        setTimeout(function() {
            setCreating(false);
            setModalState(false);
          }, 2000);
    }

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    }
    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <div className="modal_pop">
                    <form>
                        <div className="modalHeading">
                            <h3>Select the file you want to upload</h3>
                        </div>
                        <div className="modalBody">
                            {
                                uploading ? (<p className="uploading">Uploading</p>) : (
                                    <>
                                        <input type="file" onChange={handleChange} />
                                        <input type="submit" className="post_submit" onClick={handleUpload} />
                                    </>)
                            }
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal open={modalState} onClose={closeModal}>
                <div className="modal_pop">
                    <form>
                        <div className="modalHeading">
                            <h3>Create Folder</h3>
                        </div>
                        <div className="modalBody">
                            {
                                creating ? (<p className="uploading">Creating</p>) : (
                                    <>
                                        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Enter the Folder name here&nbsp;&nbsp;</label>
                                        <input type="input" value={folderName} onChange={handleFolderNameChange} />
                                        
                                        <input type="submit" value="Create" className="post_submit" onClick={handleCreateFolder} />
                                    </>)
                            }
                        </div>
                    </form>
                </div>
            </Modal>
            <div className="sidebar">
                <div className="sidebar_btn">
                    <button onClick={handleOpen}>
                        <img src={addlogo} alt=""></img>
                        <span>New File</span>
                    </button>
                    <button onClick={openModal}>
                        <img src={addlogo} alt=""></img>
                        <span>New Folder</span>
                    </button>
                </div>
                <div className="sidebar__options">
                    <div className="sidebar__option sidebaroptionActive">
                        <MobileScreenShareIcon />
                        <span><b>My Drive</b></span>
                    </div>
                    <div className="sidebar__option">
                        <DevicesIcon />
                        <span>Computers</span>
                    </div>
                    <div className="sidebar__option">
                        <PeopleAltOutlinedIcon />
                        <span>Shared with me</span>
                    </div>
                    <div className="sidebar__option">
                        <QueryBuilderOutlinedIcon />
                        <span>Recent</span>
                    </div>
                    <div className="sidebar__option">
                        <StarBorderOutlinedIcon />
                        <span>Starred</span>
                    </div>
                    <div className="sidebar__option">
                        <DeleteOutlineOutlinedIcon />
                        <span>Trash</span>
                    </div>
                </div>
                <hr />
                <div className="sidebar__options">
                    <div className="sidebar__option">
                        <CloudQueueIcon />
                        <span>Storage</span>
                    </div>
                    <div className="progress_bar">
                        <progress size="tiny" value="50" max="100" />
                        <span>6.45 GB of 15GB used</span>
                    </div>
                </div>
                <div className="sidebar_btn logout">
                    <buttton onClick={() => props.loginState(null)}>Logout</buttton>
                </div>
            </div>
        </>
    )
}

export default Sidebar
