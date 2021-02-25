/** @jsx jsx */
import { layout } from '../../libs/config'
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import Highlight, {defaultProps} from 'prism-react-renderer'
import vsDark from 'prism-react-renderer/themes/vsDark';
import Gist from 'super-react-gist'

import { InlineMath, BlockMath } from 'react-katex';


const post_width = layout.posts.max_width

const isWatchSrc = (url) => {
  const domain = "www.youtube.com"
  const arr = url.split('/')
  if(arr.includes(domain)){
    if(arr.includes('embed')){
      return url
    } else {
      const target = arr.pop()
      arr.push(target.replace('watch?v=', 'embed/'))
      return arr.join('/')
    }
  } else {
    return false
  }
}

const isRatio = (ratio) => {
  let num
  switch(typeof(ratio)){
    case "string":
      num = parseFloat(ratio)
      if(num===NaN){
        return 1
      }
      break
    case "number":
      num = ratio
      break
    default:
      break
  }
  if(num <= 0){
    return 1
  } else if(num <= 1){
    return num
  } else if(num <= 100){
    return num / 100
  } else {
    return 1
  }
}

const Prism = ({children, className}) => {
  const wrapper = css`
    overflow-x: auto;
  `
  const container = css`
    min-width: 100%;
    float: left;
    box-sizing: border-box;
    overflow-x: auto;
  `
  const language = className.replace(/language-/, '') || ""
  return (
    <div css={wrapper}>
      <Highlight {...defaultProps}
        code={children.trim()}
        language={language}
        theme={vsDark}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={className} style={{...style, padding: '20px'}}
            css={container}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line, key: i})}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({token, key})} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

const Code = ({ script, language }) => {
  return <Prism className={language}>{script.trim()}</Prism>
}

const Youtube = (props) => {
  const url = props.url ? props.url : props.src
  const ratio = props.ratio ? isRatio(props.ratio) : 1
  const src = isWatchSrc(url)
  // youtube embed url이 아니어도 연동이 가능하도록
  // 일반 url을 embed url로 바꿔주는 코드를 작성하였습니다.

  const container = css`
    max-width: calc(${post_width} * ${ratio});
  `

  const youtube = css`
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;
  `
  const iframe = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `
  if(src){
    return (
      <div css={container}>
        <div css={youtube}>
          <iframe
            css={iframe}
            src={src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  } else {
    return <div/>
  }
}

const Columns = ({ children, vr }) => {
  const isVR = vr ? true : false
  const columns = children.filter(child => {
    return child?.props?.mdxType === "Column"
  })
  const container = css`
    display: grid;
    margin: 20px 0;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 10px;
  `
  return(
    <div css={container}>
      {columns}
    </div>
  )
}
const Column = styled.div`
`

const Table = ({children}) => {
  const thead = children[0]?.props?.children?.props?.children?.length
  const container = css`
    width: auto;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  `
  const table = css`
    table-layout: fixed;
    width: 100%;
  `
  return (
    <div css={container}>
      <table css={table}>
        {children}
      </table>
    </div>
  )
}

const GistContainer = (props) => {
  return(
    <div style={{ width: "100%"}}>
      <Gist {...props} />
    </div>
  )
}


export const components = {
  code: Prism,
  Code: Code,
  Youtube: Youtube,
  Gist: Gist,
  InlineMath: InlineMath, 
  BlockMath: BlockMath,
  Columns: Columns,
  Column: Column,
  table: Table,
}