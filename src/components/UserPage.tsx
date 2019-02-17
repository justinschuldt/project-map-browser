import React, { Component } from 'react'
import {
  Skeleton, Card, Icon, Avatar, List
} from 'antd';
import { Link } from 'react-router-dom'

const { Meta } = Card;

interface IUserPageProps {
  web3: any;
  getUserPastEvents: (userAddress: string) => void;
}

class UserPage extends Component<IUserPageProps> {
  state: {
    loading: boolean
  }
  constructor(props: IUserPageProps) {
    super(props)
    this.state = {
      loading: true
    }
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState(() => ({
        loading: false
      }))
    }, 800)
  }

  render() {
    const recentActivity = [
      { name: 'royalty 1', id: 'asdfa3i' },
      { name: 'submission accepted', id: 'dfgs9a' },
      { name: 'bounty submitted', id: 'gh954gs' },
      { name: 'account created', id: 'di8wnsh' }
    ]
    const stats = [
      'Submissions: 1',
      'Accepted Submissions: 1',
      'Rejected Submissions: 0',
      'Submission earnings: $4.00',
      'Royalty earnings: $0.32'
    ]
    const badges = [
      { imageUrl: '/noob.jpg', title: 'Noob - submit for one bounty' }
    ]
    return (
      <Card
        style={{ width: '100%', padding: 12 }}
        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
      >
        <Skeleton loading={this.state.loading} avatar active>
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title="Total Earned: $4.32"
            description="Joined 18 Hours ago"
          />
          <p
            style={{
              fontSize: 24,
              color: 'rgba(0, 0, 0, 0.85)',
              margin: 24,
              fontWeight: 500
            }}
          >
            Account Data
    </p>
          <Card
            type="inner"
            title="Recent Activity"
            style={{ margin: 4 }}
          >
            <List
              size="small"
              bordered={false}
              dataSource={recentActivity}
              renderItem={(item: any) => (<List.Item>{item.name}{` transaction:   `}<Link to={`/transaction/${item.id}`} >{item.id}</Link></List.Item>)}
            />
          </Card>
          <Card
            type="inner"
            title="Stats"
            style={{ margin: 8 }}
          >
            <List
              size="small"
              bordered={false}
              dataSource={stats}
              renderItem={(item: string) => (<List.Item>{item}</List.Item>)}
            />
          </Card>
          <Card
            type="inner"
            title="Causes"
            style={{ margin: 4 }}
          >
            todo - a select and submit button
    </Card>
        </Skeleton>
      </Card>
    )
  }
}
export default UserPage
