import React from "react";  

interface DocumentBoxProps {  
  index: number;  
  uploadedFile?: { fileName: string; uploadDate: string };  
  onClick: (index: number) => void;  
}  

const DocumentBox: React.FC<DocumentBoxProps> = ({  
  index,  
  uploadedFile,  
  onClick,  
}) => (  
  <div  
    className="doc-box"  
    onClick={() => onClick(index)}  
    style={{  
      textAlign: "left",  
      border: "1px solid #ccc",  
      padding: "10px",  
      width: "300px",  
      display: "flex",  
      flexDirection: "column",  
      height: "200px",  
    }}  
  >  
    {/* Title Box (1/5 of total height) */}  
    <div  
      style={{  
        flex: "1",  
        borderBottom: "2px solid black",  
        fontWeight: "bold",  
        display: "flex",  
        alignItems: "center",  
        justifyContent: "flex-start",  
        padding: "0 10px",  
        width: "100%",        // Added to ensure full width
        boxSizing: "border-box" // Added to handle padding within width
      }}  
    >  
      Legal Document {index + 1}  
    </div>  

    {/* Content Box (Remaining 4/5 of total height) */}  
    <div style={{ 
      flex: "4", 
      paddingTop: "10px",
      width: "100%",          // Added for consistency
      boxSizing: "border-box" // Added for consistent padding behavior
    }}>  
      {uploadedFile ? (  
        <>  
          <p style={{ margin: "5px 0" }}>  
            Uploaded on: {uploadedFile.uploadDate}  
          </p>  
          <p style={{ margin: "5px 0" }}>File Name: {uploadedFile.fileName}</p>  
        </>  
      ) : (  
        <p style={{ margin: "5px 0", fontStyle: "italic", color: "#888" }}>  
          No file uploaded  
        </p>  
      )}  
    </div>  
  </div>  
);  

export default DocumentBox;