import React from "react";
import "./style.css";
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
} & typeof defaultProps;

export const BlogBox = (props: BlogBoxProps) => {
  // const state = {
  //   tagList: props.tags,
  // };
  return (
    <div className="row flex-right child-borders">
      <div className="card">
        <Link href="/blog/[slug]" as={`/blog/${props.slug}`} passHref>
          <a>
            <img
              src={props.imageUrl}
              style={{ width: "auto", height: "auto" }}
            />
          </a>
        </Link>

        <div className="card-body">
          <Link href="/blog/[slug]" as={`/blog/${props.slug}`} passHref>
            <a>
              <h3 className="card-title">{props.title}</h3>
            </a>
          </Link>
          <h4 className="card-subtitle">
            by {props.author === "" ? "DOVB" : props.author}
          </h4>
          <p className="card-text">{props.description}</p>
          <ul className="breadcrumb border">
            {props.tags.map((tag, i) => {
              return (
                <li>
                  <a key={i}>{tag}</a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

BlogBox.defaultProps = defaultProps;
