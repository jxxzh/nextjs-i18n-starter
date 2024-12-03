'use client'
import PropTypes from 'prop-types'
import React from 'react'
import {
  insertScript,
  removeResources,
  removeScript,
  shallowComparison,
} from './utils'
// Constants
import {
  CALLBACKS,
  EMBED_SCRIPT_ID,
  THREAD_ID,
} from './constants'

export default class DiscussionEmbed extends React.Component {
  componentDidMount() {
    if (typeof window !== 'undefined' && window.disqus_shortname
      && window.disqus_shortname !== this.props.shortname) {
      this.cleanInstance()
    }
    this.loadInstance()
  }

  shouldComponentUpdate(nextProps) {
    if (this.props === nextProps)
      return false
    return shallowComparison(this.props, nextProps)
  }

  componentDidUpdate(nextProps) {
    if (this.props.shortname !== nextProps.shortname)
      this.cleanInstance()
    this.loadInstance()
  }

  componentWillUnmount() {
    this.cleanInstance()
  }

  loadInstance() {
    const doc = window.document
    if (window && window.DISQUS && doc.getElementById(EMBED_SCRIPT_ID)) {
      window.DISQUS.reset({
        reload: true,
        config: this.getDisqusConfig(this.props.config),
      })
    }
    else {
      window.disqus_config = this.getDisqusConfig(this.props.config)
      window.disqus_shortname = this.props.shortname
      insertScript(`https://${this.props.shortname}.disqus.com/embed.js`, EMBED_SCRIPT_ID, doc.body)
    }
  }

  cleanInstance() {
    const doc = window.document
    removeScript(EMBED_SCRIPT_ID, doc.body)
    if (window && window.DISQUS)
      window.DISQUS.reset({})

    try {
      delete window.DISQUS
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      window.DISQUS = undefined
    }
    const disqusThread = doc.getElementById(THREAD_ID)
    if (disqusThread) {
      while (disqusThread.hasChildNodes())
        disqusThread.removeChild(disqusThread.firstChild)
    }
    removeResources()
  }

  getDisqusConfig(config) {
    return function () {
      this.page.identifier = config.identifier
      this.page.url = config.url
      this.page.title = config.title
      this.page.category_id = config.categoryID
      this.page.remote_auth_s3 = config.remoteAuthS3
      this.page.api_key = config.apiKey
      if (config.sso)
        // eslint-disable-next-line react/no-unused-class-component-members
        this.sso = config.sso
      if (config.language)
        // eslint-disable-next-line react/no-unused-class-component-members
        this.language = config.language

      CALLBACKS.forEach((callbackName) => {
        this.callbacks[callbackName] = [
          config[callbackName],
        ]
      })
    }
  }

  render() {
    const { shortname, config, ...rest } = this.props
    return (
      <div {...rest} id={THREAD_ID} style={{ maxWidth: '1020px', margin: '0 auto' }} />
    )
  }
}

DiscussionEmbed.propTypes = {
  shortname: PropTypes.string.isRequired,
  config: PropTypes.shape({
    identifier: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    language: PropTypes.string,
    categoryID: PropTypes.string,
    remoteAuthS3: PropTypes.string,
    apiKey: PropTypes.string,
    preData: PropTypes.func,
    preInit: PropTypes.func,
    onInit: PropTypes.func,
    onReady: PropTypes.func,
    afterRender: PropTypes.func,
    preReset: PropTypes.func,
    onIdentify: PropTypes.func,
    beforeComment: PropTypes.func,
    onNewComment: PropTypes.func,
    onPaginate: PropTypes.func,
    sso: PropTypes.shape({
      name: PropTypes.string,
      button: PropTypes.string,
      icon: PropTypes.string,
      url: PropTypes.string,
      logout: PropTypes.string,
      profile_url: PropTypes.string,
      width: PropTypes.string,
      height: PropTypes.string,
    }),
  }).isRequired,
}
