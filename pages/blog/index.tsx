import React, { useEffect, useState } from "react";
import { Layout } from "components/layout";
import { ContentApi } from "services";
import { BlogBox } from "components/blog";
import { GetStaticProps } from "next";

// type BlogPageProps = {
//   entries: Array<BlogPost>;
// };

export const getStaticProps: GetStaticProps = async () => {
  const api = new ContentApi();
  const data = await api.fetchBlogEntries();
  const entries = JSON.stringify(data);
  return {
    props: {
      entries,
      fallback: false,
    },
  };
};

const BlogPage = ({ entries }) => {
  const [bloglist, setBlogList] = useState([]);
  const jsonConvert = JSON.parse(entries);

  // 검색 필터 설정
  const filterSearch = (e) => {
    const search = e.target.value;
    //console.log(search);
    const filterList = jsonConvert.filter(
      (d) =>
        search === "" || d.title.toLowerCase().includes(search.toLowerCase())
    );
    if (filterList.length === 0) {
      setBlogList([]);
    } else if (filterList.length > 0) {
      setBlogList(filterList);
    } else {
      setBlogList(jsonConvert);
    }
  };

  const filterSearchTag = (e) => {
    const search = e.target.value;
    const filterList = jsonConvert.filter(
      (d) => search === "" || d.tags.includes(search)
    );
    if (filterList.length === 0) {
      setBlogList([]);
    } else if (filterList.length > 0) {
      setBlogList(filterList);
    } else {
      setBlogList(jsonConvert);
    }
  };

  useEffect(() => {
    setBlogList(jsonConvert);
  }, []);

  const renderBlogList = (entries) =>
    entries.map((entry, i) => {
      return (
        <BlogBox
          key={i}
          id={entry.id}
          slug={entry.slug}
          imageUrl={entry.heroImage.imageUrl}
          title={entry.title}
          author={entry.author?.name}
          description={entry.description}
          tags={entry.tags}
          parentCallback={filterSearchTag}
        />
      );
    });

  return (
    <Layout>
      <div className="row">
        <div className="col sm-8">
          <h1>Blog</h1>
        </div>
        <div className="col sm-4">
          <div className="form-group">
            <label htmlFor="paperInputs3">Search</label>
            <input
              className="input-block"
              type="text"
              id="paperInputs3"
              onChange={filterSearch}
            />
          </div>
        </div>
      </div>
      <div className="row mt-3">
        {bloglist.length > 0 && renderBlogList(bloglist)}
        {bloglist.length == 0 && (
          <div>
            <h2>nothing...</h2>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;
