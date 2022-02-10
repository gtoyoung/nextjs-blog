import ReactMarkdown from "react-markdown";
import React from "react";

const flatten = (text: string, child: any) => {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
};

const HeadingRenderer = (props) => {
  var children = React.Children.toArray(props.children);
  var text = children.reduce(flatten, "");

  var slug = text;
  return React.createElement("h" + props.level, { id: slug }, props.children);
};

export const MarkDown = (props) => {
  return (
    <ReactMarkdown
      source={props.source}
      renderers={{ heading: HeadingRenderer }}
    />
  );
};
