import React, { type FC } from 'react'
import './Tags.styles.scss'

interface TagsProps {
  tags: string[]
}

const Tags: FC<TagsProps> = ({ tags }) => {
  return (
        <ul className="tags">
            {tags.map((tag) => <li key={tag}> <span className="tag" >{tag}</span></li>)}
        </ul>
  )
}

export default Tags
