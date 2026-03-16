import React, { useState, useMemo, useCallback } from 'react'
import { Button, Icon, InputGroup, Tag, HTMLSelect } from '@blueprintjs/core'
import { PostAction } from '../../stores/simulationStore'
import classNames from 'classnames'

const EMOTION_COLORS: Record<string, string> = {
  anger: '#e76a6e', sadness: '#738091', fear: '#ec9a3c',
  surprise: '#f5c451', joy: '#3dcc91', disgust: '#9f7aea', neutral: '#abb3bf',
}

const AGENT_TYPE_LABELS: Record<string, string> = {
  citizen: '', kol: 'KOL', media: '媒体', government: '官方',
}

const ACTION_LABELS: Record<string, { icon: string; label: string }> = {
  post: { icon: 'edit', label: '发布' },
  repost: { icon: 'share', label: '转发' },
  comment: { icon: 'comment', label: '评论' },
  like: { icon: 'heart', label: '点赞' },
}

function timeAgo(step: number, currentStep: number): string {
  const diff = currentStep - step
  if (diff <= 0) return '刚刚'
  if (diff === 1) return '1步前'
  if (diff < 10) return `${diff}步前`
  return `${diff}步前`
}

interface PostStreamProps {
  posts: PostAction[]
  currentStep: number
  onAgentClick?: (agentId: string) => void
  className?: string
}

const PostStream: React.FC<PostStreamProps> = ({ posts, currentStep, onAgentClick, className }) => {
  const [paused, setPaused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterEmotion, setFilterEmotion] = useState<string>('all')

  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => p.action_type !== 'idle' && p.content)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.content.toLowerCase().includes(q) ||
        p.agent_name.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') {
      result = result.filter((p) => p.agent_type === filterType)
    }
    if (filterEmotion !== 'all') {
      result = result.filter((p) => p.emotion === filterEmotion)
    }
    return result.slice(0, paused ? 100 : 50)
  }, [posts, searchQuery, filterType, filterEmotion, paused])

  const handleAgentClick = useCallback((agentId: string) => {
    onAgentClick?.(agentId)
  }, [onAgentClick])

  return (
    <div className={classNames('post-stream-v2', className)}>
      {/* Controls bar */}
      <div className="post-stream-v2__controls">
        <InputGroup
          leftIcon="search"
          placeholder="搜索博文..."
          small
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          small
          minimal
          icon={paused ? 'play' : 'pause'}
          intent={paused ? 'success' : 'warning'}
          onClick={() => setPaused(!paused)}
          title={paused ? '继续滚动' : '暂停滚动'}
        />
      </div>
      <div className="post-stream-v2__filters">
        <HTMLSelect value={filterType} onChange={(e) => setFilterType(e.target.value)} iconName="caret-down">
          <option value="all">全部类型</option>
          <option value="citizen">普通用户</option>
          <option value="kol">KOL</option>
          <option value="media">媒体</option>
          <option value="government">官方</option>
        </HTMLSelect>
        <HTMLSelect value={filterEmotion} onChange={(e) => setFilterEmotion(e.target.value)} iconName="caret-down">
          <option value="all">全部情绪</option>
          <option value="anger">愤怒</option>
          <option value="sadness">悲伤</option>
          <option value="joy">快乐</option>
          <option value="surprise">惊讶</option>
          <option value="fear">恐惧</option>
          <option value="disgust">厌恶</option>
          <option value="neutral">中性</option>
        </HTMLSelect>
        <span className="post-stream-v2__count">{filteredPosts.length} 条</span>
      </div>

      {/* Post list */}
      <div className="post-stream-v2__list">
        {filteredPosts.map((post) => {
          const typeLabel = AGENT_TYPE_LABELS[post.agent_type]
          const actionInfo = ACTION_LABELS[post.action_type] || ACTION_LABELS.post
          const emotionColor = EMOTION_COLORS[post.emotion] || '#738091'
          return (
            <div key={post.id} className="weibo-post" onClick={() => handleAgentClick(post.agent_id)}>
              {/* Avatar */}
              <div className="weibo-post__avatar-col">
                <div className={classNames('weibo-post__avatar', `weibo-post__avatar--${post.agent_type}`)}>
                  {post.agent_name.charAt(0)}
                </div>
                {post.action_type === 'repost' && (
                  <div className="weibo-post__thread-line" />
                )}
              </div>

              {/* Content */}
              <div className="weibo-post__body">
                {/* Header row */}
                <div className="weibo-post__header">
                  <span className="weibo-post__name">{post.agent_name}</span>
                  {typeLabel && (
                    <Tag minimal round className="weibo-post__type-badge"
                      style={{ background: `rgba(76,144,240,0.15)`, color: '#4c90f0', fontSize: 10 }}>
                      {typeLabel}
                    </Tag>
                  )}
                  <span className="weibo-post__time">{timeAgo(post.step, currentStep)}</span>
                </div>

                {/* Handle line */}
                <div className="weibo-post__handle">
                  @{post.agent_id.replace('user_', 'u')} · Step {post.step}
                </div>

                {/* Action indicator for reposts */}
                {post.action_type === 'repost' && (
                  <div className="weibo-post__action-indicator">
                    <Icon icon="share" size={11} color="var(--text-muted)" />
                    <span>转发了一条微博</span>
                  </div>
                )}
                {post.action_type === 'comment' && (
                  <div className="weibo-post__action-indicator">
                    <Icon icon="comment" size={11} color="var(--text-muted)" />
                    <span>发表了评论</span>
                  </div>
                )}

                {/* Post content */}
                <div className="weibo-post__content">{post.content}</div>

                {/* Emotion & stance tags */}
                <div className="weibo-post__tags">
                  <span className="weibo-post__emotion-dot" style={{ background: emotionColor }} />
                  <span className="weibo-post__emotion-text" style={{ color: emotionColor }}>{post.emotion}</span>
                  <span className="weibo-post__stance">{post.stance}</span>
                </div>

                {/* Action bar (Twitter-style) */}
                <div className="weibo-post__actions">
                  <div className="weibo-post__action-btn">
                    <Icon icon="comment" size={13} />
                    <span>{Math.floor(Math.random() * 20)}</span>
                  </div>
                  <div className="weibo-post__action-btn weibo-post__action-btn--repost">
                    <Icon icon="share" size={13} />
                    <span>{Math.floor(Math.random() * 50)}</span>
                  </div>
                  <div className="weibo-post__action-btn weibo-post__action-btn--like">
                    <Icon icon="heart" size={13} />
                    <span>{Math.floor(Math.random() * 100)}</span>
                  </div>
                  <div className="weibo-post__action-btn">
                    <Icon icon="more" size={13} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filteredPosts.length === 0 && (
          <div className="post-stream-v2__empty">
            <Icon icon="search" size={20} color="var(--text-muted)" />
            <span>暂无匹配的博文</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostStream
