import React from "react";
// import "./style.css";
import Link from "next/link";

const defaultProps = {
  author: "",
  description: "",
  publishedDate: "",
  readingTime: "",
  className: "",
};

type BlogBoxProps = {
  id: string;
  slug: string;
  imageUrl: string;
  title: string;
  tags?: Array<string>;
  parentCallback: Function;
} & typeof defaultProps;

export const BlogBox = (props: BlogBoxProps) => {
  const onTrigger = (e) => {
    props.parentCallback(e);
    e.preventDefault();
  };

  return (
    <div className="card">
      <Link href="/blog/[slug]" as={`/blog/${props.slug}`} passHref legacyBehavior>
        <a>
          <img src={props.imageUrl} style={{ width: "auto", height: "auto" }} />
        </a>
      </Link>

      <div className="card-body">
        <Link href="/blog/[slug]" as={`/blog/${props.slug}`} passHref legacyBehavior>
          <a>
            <h3 className="card-title">{props.title}</h3>
          </a>
        </Link>
        <h4 className="card-subtitle">
          by {props.author === "" ? "DOVB" : props.author}
        </h4>
        <p className="card-text">{props.description}</p>
        <ul className="breadcrumb">
          {props.tags.map((tag, i) => {
            return (
              <li>
                <button
                  className="btn-small"
                  key={i}
                  value={tag}
                  onClick={onTrigger}
                >
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

BlogBox.defaultProps = defaultProps;
