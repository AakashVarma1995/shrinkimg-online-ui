import { useState } from 'react';
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  root:{
    position:'relative',
  },
  background:{
    backgroundSize:'cover',
    backgroundPosition:'center',
    backgroundImage:"url('/images/background.jpg')",
    minHeight:'100vh',
    minWidth:"100%",
    position:'fixed',
    top:0,
    left:0,
    zIndex:-2
    
  },
  overlay:{
    background:'rgba(0,0,0,.6)',
    minHeight:'100vh',
    minWidth:"100%",
    position:'fixed',
    top:0,
    left:0,
    zIndex:-1
    // backdropFilter: 'blur(4px)'
  },
  content:{
    display:'grid',
    placeItems:'center',
    minHeight:'100vh',
    minWidth:"100%",
  },
  centerCard:{
    background:'white',
    padding:'16px',
    borderRadius:"16px",
    display:'inline-grid',
    gridTemplateColumns:'auto auto',
    // justifyContent:'center',
    alignItems:'center',

  },
  footer:{
    position:'fixed',
    bottom:'0',
    background:'rgba(0,0,0,.6)',
    color:'white',
    textAlign:'center',
    paddingTop:'12px',
    paddingBottom:'12px',
    width:'100%',    
  },

  leftContainer:{
    width:"100%",
    marginRight:'16px'
  },
  rightContainer:{
    
  },
  selectedImage:{
    width:"250px",
    height:'250px',
    position:'relative',
    borderRadius:'28px'
  },

  imageName:{
    position:'absolute',
    bottom:0,
    left:0,
    width:'100%',
    textAlign:'center',
    paddinTop:'8px',
    paddinBottom:'80px',
    background:'rgba(0,0,0,.7)',
    borderRadius:'0px 0px 28px 28px',
    overflow:'hidden'

  },
  colName:{
    padding:"8px"
  },
  inputNum:{
    width:'60px',
    padding:'8px',
    border:'none',
    outline:'none',
    background:'#E2E2E2',
    borderRadius:'50px',
    color:'black',
    textAlign:'center',
    fontFamily:'Raleway',
    fontSize:"1.1rem",
    margin:'8px'
  },

  uploadBtn:{
    background:"#FF4230",
    color:'white',
    padding:'8px 16px 8px 16px',
    borderRadius:'45px',
    margin:'8px',
    cursor:'pointer'
  },

  downloadBtn:{
    background:'#059E1F',
    width:'100%',
    outline:'none',
    border:'none',
    padding:'8px',
    color:'white',
    fontSize:'1.1rem',
    borderRadius:"50px",
    cursor:'pointer',
    transition:'.5s ease',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    '&:hover':{
      background:"#00A51C"
    }

  },

  inputCol:{
    display:'flex',
    justifyContent:'center'
  },
  errorBox:{
    background:'#F8D7DA',
    border:'1px solid #F5C6CB',
    padding:'8px',
    color:'#8B3F46',
    borderRadius:'35px',
    textAlign:'center',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'1rem',
    maxWidth:'450px',
    margin:"0 auto"
  },

  '@media screen and (max-width: 600px)': {
    centerCard:{
      width:'calc(100% - 50px)'
    },
    selectedImage:{
      display:'none'
    },
    leftContainer:{
      gridColumn:"span 3"
    },
    inputCol:{
      justifyContent:'flex-end'
    }
  },

})

function App() {
  const classes = useStyles();
  const fileNameLimit = 20;
  const [selectedImg, setSelectedImg] = useState(null);
  const [seletedFileName, setSelectedFileName] = useState(null)
  const [width, setWidth] = useState("auto");
  const [height, setHeight] = useState(300);
  const [quality, setQuality] = useState(60)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("There was some error")

  const handleChangeFile=(e)=>{
    let file = e.target.files[0];
    if(file.name.length > fileNameLimit){
      setSelectedFileName(file.name.substring(0,fileNameLimit)+"...")
    }
    else{
      setSelectedFileName(file.name)

    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      
      setSelectedImg(reader.result);
    };
  }

  const handleSubmit = (e)=>{
    // e.preventDefault();
    setIsLoading(true)
    setError(null);
    fetch('/compress', {
      method: 'post',
      body: JSON.stringify({
        image:selectedImg,
        width:width,
        height:height,
        quality:quality
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response=>response.json())
    .then(data=>{
      setIsLoading(false)
      if(data.url){
        const link = document.createElement('a');
      link.href = data.url;
      link.target="_blank"
      link.setAttribute(
        'download',
        data.file_name,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      }
      else if (data.error){
        setError(data.error)
      }
    })
    
  }

  return (
    <div className={classes.root}>
      <div className={classes.background}/>
      <div className={classes.overlay}/>
      <div className={classes.content}>
        <div className={classes.centerCard}>
            <div className={classes.leftContainer}>
              <table width="100%">
                <tr>
                  <td className={classes.colName} style={{padding:'16px 8px'}}>Select Image</td>
                  <td className={classes.inputCol} ><input type="file" id="filename" style={{display:'none'}} accept='.jpg, .jpeg, .png, .bmp' onChange={e=>handleChangeFile(e)}/><label for="filename" className={classes.uploadBtn}>{selectedImg?"Uploaded":"Upload"}</label></td>
                </tr>

                <tr>
                  <td className={classes.colName}>Height (px)</td>
                  <td className={classes.inputCol}><input type='text' className={classes.inputNum} value={height} onChange={(e)=>setHeight(e.target.value)}></input></td>
                </tr>

                <tr>
                  <td className={classes.colName}>Width (px)</td>
                  <td className={classes.inputCol}><input type='text' className={classes.inputNum} value={width} onChange={e=>setWidth(e.target.value)}></input></td>
                </tr>

                <tr>
                  <td className={classes.colName}>Quality (%)</td>
                  <td className={classes.inputCol}><input type='number' className={classes.inputNum} value={quality} onChange={e=>{
                    if(e.target.value<1){
                      setQuality(1)
                    }else if(e.target.value>100){
                      setQuality(100)
                    }
                    else{
                      setQuality(e.target.value)
                    }
                  }} max={100} min={1}></input></td>
                </tr>
              </table>
            </div>

            <div className={classes.rightContainer}>
                <div className={classes.selectedImage} style={{backgroundImage:selectedImg?`url(${selectedImg})`:`url("https://via.placeholder.com/250x250")`,backgroundSize:'cover',backgroundPosition:'center'}}>
                  <div className={classes.imageName}><div style={{position:'relative',padding:"8px", color:'white'}}>{seletedFileName?seletedFileName:"No File Selected"}</div></div>
                </div>
            </div>

            {
              error && <div style={{gridColumn:'span 2', marginTop:'16px'}}>
              <div className={classes.errorBox} >
                <img src='/images/error.svg' style={{marginRight:'8px'}}></img> <span>{error}</span>
              </div> 
            </div>
            }

            <div style={{gridColumn:'span 3', marginTop:'16px'}}>
              <button className={classes.downloadBtn} onClick={e=>handleSubmit(e)} style={isLoading?{pointerEvents:'none'}:{}}>
                Download Image {isLoading && <img src="/images/bars.svg" style={{marginLeft:'8px', height:'20px'}}/>}
              </button>
            </div>
        </div>
      </div>

      <footer className={classes.footer}>
          Copyright © ShrinkImg.Online 2020
      </footer>
      
    </div>
  )
}

export default App;
