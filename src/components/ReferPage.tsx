"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { Users, Copy, CheckCircle, Share2, DollarSign, UserPlus, Gift, TrendingUp } from "lucide-react"
import api from "@/lib/axios"

export function ReferPage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [referralData, setReferralData] = useState<any>(null)
  const [referralStats, setReferralStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get the current domain for the referral link
  const currentDomain = window.location.origin
  const referralBonus = 5.0
  const secondTierBonus = 1.0

  // Calculate referral link dynamically based on loaded data
  const getReferralLink = () => {
    const userId = user?._id;
    
    if (loading) {
      return `${currentDomain}/signup?ref=LOADING...`;
    }
    if (!userId) {
      return `${currentDomain}/signup?ref=NO_USER_ID`;
    }
    return `${currentDomain}/signup?ref=${userId}`;
  };

  // Fetch referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const [infoResponse, statsResponse] = await Promise.all([
          api.get('/api/referrals/my-info'),
          api.get('/api/referrals/stats')
        ]);
        
        setReferralData(infoResponse.data);
        setReferralStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReferralData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getReferralLink())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join TaskEarn and Start Earning!",
        text: "I'm earning money completing simple tasks on TaskEarn. Join me and get a $5 bonus!",
        url: getReferralLink(),
      })
    } else {
      handleCopyLink()
    }
  }

  const referralStatsData = [
    {
      title: "Total Referrals",
      value: referralStats?.totalReferrals || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Referral Earnings",
      value: `$${((referralStats?.totalReferrals || 0) * referralBonus).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "This Month",
      value: referralStats?.thisMonthReferrals || 0,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Pending Bonuses",
      value: `$${((referralStats?.pendingReferrals || 0) * referralBonus).toFixed(2)}`,
      icon: Gift,
      color: "text-orange-600",
    },
  ]

  const recentReferrals = referralData?.recentReferrals || []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Refer Friends</h1>
        <p className="text-gray-600 mt-2">Earn ${referralBonus} for each friend you refer</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          referralStatsData.map((stat, index) => {
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
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Your Referral Link
            </CardTitle>
            <CardDescription>Share this link with friends to earn bonuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Referral Link</label>
              <div className="flex items-center space-x-2">
                <Input value={getReferralLink()} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Simple steps to earn referral bonuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Share Your Link</h4>
                  <p className="text-sm text-gray-600">Send your unique referral link to friends and family</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Friend Signs Up</h4>
                  <p className="text-sm text-gray-600">They register using your link and get a $5 bonus</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">You Earn Bonus</h4>
                  <p className="text-sm text-gray-600">You receive $5 when they make their first deposit</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Bonus Structure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-800">Direct Referral:</span>
                  <span className="font-medium text-green-900">$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-800">Second Tier:</span>
                  <span className="font-medium text-green-900">$1.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Your latest referral activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading referrals...</p>
              </div>
            ) : recentReferrals.length > 0 ? (
              recentReferrals.map((referral: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{referral.referred?.email || referral.referred?.username}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      ${referral.status === 'completed' ? '5.00' : '0.00'}
                    </p>
                    <Badge variant={referral.status === "completed" ? "default" : "secondary"}>
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No referrals yet</p>
                <p className="text-sm text-gray-500">Share your referral link to start earning!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 