import React from "react";
import { BlogPost } from "services";
import styled from "styled-components";
import { Toc } from "components/util/toc";
import { MarkDown } from "components/util/markdown";
import "./style.css";

const Image = styled.img`
  width: 40%;
  height: 150px;
  object-fit: cover;
`;

const TocDiv = styled.div`
  position: fixed;
  top: 5em;
  right: 6em;
`;

type BlogDetailProps = {
  post: BlogPost;
};

export const BlogDetail = (props: BlogDetailProps) => {
  const { post } = props;
  const mainTag = post.tags.length > 0 ? post.tags[0] : "";
  return (
    <>
      <article className="article">
        <h1 className="article-title">{post.title}</h1>
        <p className="article-meta">
          Written by {post.author?.name ? "DOVB" : post.author?.name} on{" "}
          {`${post.publishedDate}   realted tag ${mainTag}`}
        </p>
        <p className="text-lead">
          <MarkDown source={post.body} />
        </p>
        <TocDiv>
          <Toc content={post.body} />
        </TocDiv>
      </article>
    </>
  );
};
