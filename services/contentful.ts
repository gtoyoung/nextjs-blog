import { ContentfulClientApi, createClient } from "contentful";
import {
  Author,
  HeroImage,
  BlogPost,
  Photo,
  PhotoPost,
  Slug,
} from "../type/contentful.types";
import moment from "moment";

export class ContentApi {
  client: ContentfulClientApi;

  constructor() {
    this.client = createClient({
      space: process.env.NEXT_PUBLIC_SPACE_ID,
      accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
    });
  }

  convertPhoto = (photo): Photo => {
    const raw = photo.fields.file;

    return {
      fileName: raw.fileName,
      url: raw.url.replace("//", "http://"),
    };
  };

  convertPhotoPost = (photoPost): PhotoPost => {
    const rawPhoto = photoPost.fields;
    return {
      takeDate: rawPhoto.takeDate,
      description: rawPhoto.description,
      slug: rawPhoto.slug,
      photo: this.convertPhoto(rawPhoto.photo),
    };
  };

  convertImage = (rawImage): HeroImage => {
    if (rawImage) {
      return {
        imageUrl: rawImage.file.url.replace("//", "http://"), // may need to put null check as well here
        description: rawImage.description,
        title: rawImage.title,
      };
    }
    return null;
  };

  convertAuthor = (rawAuthor): Author => {
    if (rawAuthor) {
      return {
        name: rawAuthor.name,
        phone: rawAuthor.phone,
        shortBio: rawAuthor.shortBio,
        title: rawAuthor.title,
        email: rawAuthor.email,
        company: rawAuthor.company,
        twitter: rawAuthor.twitter,
        facebook: rawAuthor.facebook,
        github: rawAuthor.github,
      };
    }
    return null;
  };

  convertPost = (rawData): BlogPost => {
    const rawPost = rawData.fields;
    const rawHeroImage = rawPost.heroImage ? rawPost.heroImage.fields : null;
    const rawAuthor = rawPost.author ? rawPost.author.fields : null;
    return {
      id: rawData.sys.id,
      body: rawPost.body,
      description: rawPost.description,
      publishedDate: moment(rawPost.publishDate).format("DD MMM YYYY"),
      slug: rawPost.slug,
      tags: rawPost.tags,
      title: rawPost.title,
      heroImage: this.convertImage(rawHeroImage),
      author: this.convertAuthor(rawAuthor),
      metaTitle: rawPost.metaTitle,
      metaDescription: rawPost.metaDescription,
      metaImage: rawPost.metaImage
        ? rawPost.metaImage.fields.file.url.replace("//", "http://")
        : "",
    };
  };

  convertSlug = (post): Slug => {
    return {
      slug: post.slug,
    };
  };

  async fetchBlogEntries(): Promise<Array<BlogPost>> {
    return await this.client
      .getEntries({
        content_type: "blogPost", // only fetch blog post entry
      })
      .then((entries) => {
        if (entries && entries.items && entries.items.length > 0) {
          const blogPosts = entries.items.map((entry) =>
            this.convertPost(entry)
          );
          return blogPosts;
        }
        return [];
      });
  }

  async fetchBlogById(slug: string): Promise<BlogPost> {
    return await this.client
      .getEntries({
        content_type: "blogPost",
        "fields.slug[in]": slug,
      })
      .then((entries) => {
        if (entries && entries.items && entries.items.length > 0) {
          // Assuming it always have unique slug for every blog entry
          const post = this.convertPost(entries.items[0]);
          return post;
        }
        return null;
      });
  }

  /**
   * 최근 게시물 목록 (최대 3개)
   * @returns
   */
  async fetchBlogRecentEntries(): Promise<Array<BlogPost>> {
    return await this.client
      .getEntries({
        content_type: "blogPost", // only fetch blog post entry
      })
      .then((entries) => {
        if (entries && entries.items && entries.items.length > 0) {
          const blogPosts = entries.items.map((entry) =>
            this.convertPost(entry)
          );
          return blogPosts;
        }
        return [];
      })
      .then((posts) => {
        return posts.sort((a, b) => {
          return (
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
          );
        });
      })
      .then((sorted) => {
        return sorted.slice(0, sorted.length > 3 ? 3 : sorted.length);
      });
  }

  async fetchPhotoEntries(): Promise<Array<PhotoPost>> {
    return await this.client
      .getEntries({
        content_type: "photo",
      })
      .then((entries) => {
        if (entries && entries.items && entries.items.length > 0) {
          const photo = entries.items.map((entry) =>
            this.convertPhotoPost(entry)
          );
          return photo;
        }
        return [];
      });
  }

  async fetchBlogSlugList(): Promise<Array<Slug>> {
    return await this.client
      .getEntries({
        content_type: "blogPost",
      })
      .then((entries) => {
        if (entries && entries.items && entries.items.length > 0) {
          const blogPosts = entries.items.map((entry) =>
            this.convertPost(entry)
          );
          return blogPosts;
        }
        return [];
      })
      .then((post) => {
        return post.map((post) => {
          return this.convertSlug(post);
        });
      });
  }
}
