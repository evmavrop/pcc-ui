import React, {useEffect} from "react";

// prismjs and theme to highlight xml snippets in location values
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// prism plugin to make links interactive in code box
import 'prismjs/plugins/autolinker/prism-autolinker';
  
// Small codebox with prismjs syntax highlighting
// If needed elsewhere should be moved to it's own component
// to use it for xml use <CodeBox lang=xml code={your xml snippet} />
const CodeBox = (props) => {

    useEffect(() => {
      Prism.highlightAll();
    }, []);
  
    return <pre><code className={"language-"+props.lang}>
      {props.code}
    </code></pre>
  
  }

export {CodeBox};

