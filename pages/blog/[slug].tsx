import React, { useState } from "react";
import { Layout } from "components/layout";
import { BlogDetail } from "components/blog";
import { ContentApi } from "services";
import { NextSeo } from "next-seo";
import { GetStaticPaths, GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params["slug"] as string;
  const api = new ContentApi();
  const result = await api.fetchBlogById(slug);
  const post = JSON.stringify(result);
  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const api = new ContentApi();
  const slugList = await api.fetchBlogSlugList();
  const paths = slugList.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

const BlogDetailPage = ({ post }) => {
  const jsonConvert = JSON.parse(post);
  const [blog, setBlog] = useState(jsonConvert);

  return (
    <Layout>
      <NextSeo
        openGraph={{
          type: "article",
          title: blog.metaTitle,
          description: blog.metaDescription,
          images: [
            {
              url: blog.metaImage,
              width: 850,
              height: 650,
              alt: blog.metaTitle,
            },
          ],
        }}
        title={blog.metaTitle}
        description={blog.metaDescription}
      />
      <div className="row">
        <div className="col-12">
          {!blog && <div>Loading...</div>}
          {blog && <BlogDetail post={blog} />}
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetailPage;
