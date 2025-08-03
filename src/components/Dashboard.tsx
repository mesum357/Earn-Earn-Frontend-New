"use client"

import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { CreditCard, CheckSquare, Users, Gift, Lock, TrendingUp, DollarSign, Activity } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Balance",
      value: `$${user?.balance || 0}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Referrals",
      value: user?.referralCount || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Lucky Draw Entries",
      value: user?.luckyDrawEntries || 0,
      icon: Gift,
      color: "text-purple-600",
    },
    {
      title: "Tasks Completed",
      value: "12",
      icon: CheckSquare,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    {
      title: "Deposit Funds",
      description: "Add money to start earning",
      icon: CreditCard,
      link: "/deposit",
      color: "bg-green-500",
    },
    {
      title: "View Tasks",
      description: user?.hasDeposited ? "Complete tasks to earn" : "Need $10 deposit to unlock",
      icon: user?.hasDeposited ? CheckSquare : Lock,
      link: user?.hasDeposited ? "/tasks" : "/deposit",
      color: user?.hasDeposited ? "bg-blue-500" : "bg-gray-400",
    },
    {
      title: "Refer Friends",
      description: "Earn from referrals",
      icon: Users,
      link: "/refer",
      color: "bg-purple-500",
    },
    {
      title: "Lucky Draw",
      description: "Try your luck",
      icon: Gift,
      link: "/lucky-draw",
      color: "bg-pink-500",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your account today.</p>
      </div>

      {/* Deposit Alert */}
      {!user?.hasDeposited && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-8 w-8 text-orange-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">Tasks Locked</h3>
                  <p className="text-orange-700">You need to make a minimum $10 deposit to unlock task earning features.</p>
                  <p className="text-orange-600 text-sm mt-1">Current Balance: ${user?.balance?.toFixed(2) || '0.00'} (First $10 deposit unlocks tasks)</p>
                </div>
              </div>
              <Link to="/deposit">
                <Button className="bg-orange-600 hover:bg-orange-700">Make Deposit</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white mr-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest transactions and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user?.hasDeposited ? (
              <>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Task Completed</p>
                      <p className="text-sm text-gray-600">Social media engagement task</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+$2.50</Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Referral Bonus</p>
                      <p className="text-sm text-gray-600">Friend joined via your link</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+$5.00</Badge>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Deposit</p>
                      <p className="text-sm text-gray-600">Binance transfer</p>
                    </div>
                  </div>
                  <Badge variant="outline">+$18.00</Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activity yet. Make your first deposit to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 