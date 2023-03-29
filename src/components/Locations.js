import React, {useState} from "react";
import { CodeBox } from "./CodeBox";

// quick and dirty formatter to pretty print small xml snippets
function quickFmtXML(xml) {
  
  // Use a regex to add line breaks and indentation
  const lines = xml.split(/(?=<)/g);
  let result = "";
  for (let ind =0, i = 0; i < lines.length; i++) {
      let item = lines[i].trim()
      if (item.startsWith("</")) {
        ind--;
      }
      result += "  ".repeat(ind) + item + "\n";
      if (item.endsWith("/>") == false) {
        ind++;
      }
    }
    return result;
  }

// parses Locations xml and returns a list of json objects with id,href fields
function parseLocations(xml) {
  let parser = new DOMParser();
  // parse the xml given as dom elements
  let locXML = parser.parseFromString(xml,"text/xml"); 
  // query xml dom elements by location tag and keep only the href,id values
  return Array.from(locXML.getElementsByTagName("location")).map(x=>({href:x.getAttribute("href"), id:x.getAttribute("id")}))
}

// View Locations XML values
const Locations = (props) => {

  // default view is not the xml
  const [viewXML, setViewXML] = useState(false);
  let btnMsg = "View original XML entry..."
  let content = null
  const prettyXML = quickFmtXML(props.xml)
  const parsedLocations = parseLocations(props.xml)

  if (viewXML) {
    btnMsg = "View Location links..."
    content = <CodeBox code={prettyXML} lang="xml"/>
  } else {
    
    let items = []
    for (let loc of parsedLocations) {
      items.push(<li key={loc.id}><span>🔗 {loc.id} - <a target="_blank" href={loc.href}>{loc.href}</a></span></li>)
    }
    content = <ul className="location-list">{items}</ul>
  }

  return <div>{content}<div class="text-right"><button className="btn btn-sm" onClick={()=>{setViewXML(!viewXML)}}>{btnMsg}</button></div></div>

    
  
}

export {Locations};

