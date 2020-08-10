const socket = io('/');
const myvideo = document.createElement('video')
const videogrid = document.getElementById('video-grid');
myvideo.muted =true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
})

let myvideostream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myvideostream = stream;
    addVideostream(myvideo,stream);
    
    peer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream',userVideoStream =>{
            addVideostream(video, userVideoStream);
        })
    })

    socket.on('user-connected',(userID)=>{
        connectNewUser(userID ,stream)
    })

    let msg = $('input');


    $('html').keydown((e)=>{
        if(e.which == 13 && msg.val().length !== 0){
            socket.emit('message',msg.val());
            msg.val('');
        }
    })

    socket.on('createmessage',message=>{
        console.log('this is server' + message);
        $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrolltobottom();
    })
})
 


peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})



const connectNewUser =(userID ,stream) =>{
     const call =peer.call(userID,stream)
     const video = document.createElement('video')
     call.on('stream',userVideoStream =>{
         addVideostream(video,userVideoStream)
     })
}

const addVideostream = (video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video);

}

const scrolltobottom =() =>{
    let d =$('.main-chat-window') ;
    d.scrollTop(d.prop("scrollHeight"))
}

const muteunmute =()=>{
    console.log(myvideostream);
    const enable = myvideostream.getAudioTracks()[0].enabled;
    if(enable){
        myvideostream.getAudioTracks()[0].enabled =false;
        setunmutebutton();
    }else{
        setmutebutton();
        myvideostream.getAudioTracks()[0].enabled =true;
    }
}
const setmutebutton =()=>{
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main-mute-button').innerHTML=html;
}

const setunmutebutton =()=>{
    const html = `<i class="unmuteee fas fa-microphone-slash"></i>
    <span>Unmute</span>`
    document.querySelector('.main-mute-button').innerHTML=html;
}

const playstop =()=>{
    let enable = myvideostream.getVideoTracks()[0].enabled;
    if(enable){
        myvideostream.getVideoTracks()[0].enabled = false;
        setplayvideo();
    }else{
        setstopvideo();
        myvideostream.getVideoTracks()[0].enabled =true;
    }
}
const setplayvideo = ()=>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`;
    document.querySelector(".main-video-button").innerHTML = html;
}

const setstopvideo =()=>{
    const html = `<i class="fas fa-video"></i>
    <span>stop video</span>`
    document.querySelector(".main-video-button").innerHTML =html
}