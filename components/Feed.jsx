'use client'

import { useState,useEffect } from "react"

import PromptCard from "./PromptCard"

const PromptCardList = ({data,handleTagClick})=>{
  
  return(
    <div className="mt-16 prompt_layout">
      {data.map((post)=>(
        <PromptCard 
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText,setSearchText] = useState('');
  const [searchTimeout,setSearchTimeout]=useState(null);
  const [searchResults,setSearchResults]=useState([]);


  const fetchPosts = async ()=>{
    const response = await fetch('/api/prompt');
    const data = await response.json();
    setAllPosts(data);
  };

  useEffect(()=>{
    fetchPosts();
  },[])
  
  const filterPrompts = (searchText)=>{
    const regex=new RegExp(searchText,"i") // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item)=> regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt)
    )
  }
  const handleSearchChange = async (e) =>{
    clearTimeout(searchTimeout);
    const searchText = e.target.value;
    setSearchText(searchText);
    setSearchTimeout(
      setTimeout(()=>{
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      },500)
    );
  };

  const handleTagClick = (tagName)=>{
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchResults(searchResult);
  }

  return (
    <section className="feed">
      {/* this from is to allow user to search */}
      <form className="relative w-full flex-center">
        <input
          type='text'
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={searchText?searchResults:allPosts}
        handleTagClick = {handleTagClick}
      />
    </section>
  )
}

export default Feed