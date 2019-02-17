import React, { Component } from 'react'
import { Button, Card } from 'antd';

interface IAdminPageProps {
  web3: any
}

class AdminPage extends Component<IAdminPageProps> {
  constructor(props: IAdminPageProps) {
    super(props)
    this.do = this.do.bind(this)
  }
  do() {
    console.log('button clicked')
  }
  render() {
    return (
      <div>
        <Card title="Admin Page" bordered={false} style={{ width: '100%' }}>
          <p>Card content</p>
          <Button onClick={this.do}>do action</Button>
        </Card>
      </div>
    )
  }
}
export default AdminPage
