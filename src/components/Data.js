import React,{useState, useEffect} from 'react'
import "../css/data.css"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListIcon from '@mui/icons-material/List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { db,storage } from '../firebase';
import { Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Data(props) {
    const [files , setFiles]= useState([]);
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
      db.collection(`${props.userData.displayName}`).onSnapshot(snapshot=>{
            setFiles(snapshot.docs.map(doc=>({
                id:doc.id,
                data: doc.data()
            })))
      })
    }, [])

    function formatBytes(bytes, decimals =2){
        if(bytes === 0) return '0 Bytes';

        const k=1024;
        const dm =decimals<0 ? 0 : decimals;
        const sizes =['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'];
        const i= Math.floor(Math.log(bytes)/Math.log(k));

        return parseFloat((bytes/Math.pow(k,i)).toFixed(dm))+ ' ' + sizes[i];
    }

    const deleteFile = (filename, fileURL) => {
        setDeleting(true);
        console.log(`File ${filename} was deleted`);
        var file_query = db.collection(`${props.userData.displayName}`).where('fileURL', '==', fileURL);
        file_query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });
        setTimeout(() => {
            setDeleteModalState(false);
            setDeleting(false);            
        }, 3500);
    }

    const handleClose = () => {
        setDeleteModalState(false)
    }

    return (
       
        <div className="data">
            <div className="data__header">
                <div className="data__headerLeft">
                    <p>My Drive</p>
                    <ArrowDropDownIcon/>
                </div>
                <div className="data__headerRight">
                        <ListIcon/>
                        <InfoOutlinedIcon/>
                </div>
            </div>
            <div className="data__content">
                <div className="data_grid">
                    {
                        files.map((file)=>{
                            return <>
                                    <div className="data_file"> 
                                    <InsertDriveFileIcon/>
                                    <p><a href={file.data.fileURL} target="_blank">{file.data.filename}</a></p>
                                    </div>
                                    </>
                        })
                    }
                    

                </div>
                <div className="data_list">
                    <div className="detailsrow">
                        <p><b>Name <ArrowDownwardIcon/></b></p>
                        <p><b>Owner</b></p>
                        <p><b>Created At</b></p>
                        <p><b>File Size</b></p>
                    </div>
                    {
                        files.map((file)=>{
                            return <div className="detailsrow">
                            <p> <a href={file.data.fileURL} target="_blank">
                                <InsertDriveFileIcon/>{file.data.filename}</a></p>
                            <p>{file.data.username}</p>
                            <p>{ new Date(file.data.timestamp?.seconds*1000).toUTCString()}</p>
                            <p>{formatBytes(file.data.size)}</p>
                            <p><button onClick={() =>setDeleteModalState(true)}><DeleteIcon /></button></p>
                                <Modal open={deleteModalState} onClose={handleClose}>
                                    <div className="modal_pop">
                                        <form>
                                            <div className="modalHeading">
                                                <h3>Confirm Delete Operation?</h3>
                                            </div>
                                            <div className="modalBody">
                                                {
                                                    deleting ? (<p className="uploading">Deleting</p>) : (
                                                        <>  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <button onClick={()=>deleteFile(file.data.filename, file.data.fileURL)}>Yes</button>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <button onClick={()=>setDeleteModalState(false)}>No</button>
                                                            </label>
                                                        </>)
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </Modal>
                            </div>
                        })
                    }
                    
                </div>

            </div>
        </div>
    )
}

export default Data
