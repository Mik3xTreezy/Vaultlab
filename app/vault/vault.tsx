"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  ExternalLink,
  Globe,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"

function MiniChart({ data }: { data: { views: number }[] }) {
  return (
    <LineChart width={60} height={24} data={data} style={{ background: "transparent" }}>
      <Line
        type="monotone"
        dataKey="views"
        stroke="#fff"
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  )
}

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState("")
  const [lockers, setLockers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocker, setSelectedLocker] = useState<any>(null)
  const [lockerAnalytics, setLockerAnalytics] = useState<any>(null)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [lockerCharts, setLockerCharts] = useState<Record<string, { chartData: any[], totalViews: number }>>({})

  const bestPerformingLockers = [
    { title: "Youtube", views: "2 views", id: "qXDUiGH9m" },
    { title: "No data", views: "No views", id: "No data" },
    { title: "No data", views: "No views", id: "No data" },
    { title: "No data", views: "No views", id: "No data" },
    { title: "No data", views: "No views", id: "No data" },
    { title: "No data", views: "No views", id: "No data" },
  ]

  useEffect(() => {
    async function fetchLockers() {
      setLoading(true)
      const res = await fetch("/api/lockers")
      const data = await res.json()
      setLockers(data)
      setLoading(false)
    }
    fetchLockers()
  }, [])

  useEffect(() => {
    if (!loading && lockers.length > 0) {
      Promise.all(
        lockers.map(locker =>
          fetch(`/api/locker-analytics/${locker.id}`)
            .then(res => res.json())
            .then(data => ({
              id: locker.id,
              chartData: data.chartData || [],
              totalViews: data.overview?.views ?? 0,
            }))
        )
      ).then(results => {
        const charts: Record<string, { chartData: any[], totalViews: number }> = {}
        results.forEach(({ id, chartData, totalViews }) => {
          charts[id] = { chartData, totalViews }
        })
        setLockerCharts(charts)
      })
    }
  }, [loading, lockers])

  // Fetch analytics when a locker is selected
  useEffect(() => {
    if (selectedLocker && analyticsOpen) {
      setLockerAnalytics(null)
      fetch(`/api/locker-analytics/${selectedLocker.id}`)
        .then(res => res.json())
        .then(data => setLockerAnalytics(data))
    }
  }, [selectedLocker, analyticsOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Vault</h1>
            <p className="text-gray-400 text-sm">apklox9539@gmail.com</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Create link locker
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Best Performing Lockers */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Best performing lockers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {bestPerformingLockers.map((locker, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        {locker.title === "Youtube" ? (
                          <Globe className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-600 rounded"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{locker.id}</span>
                    </div>
                    <h3 className="text-white font-medium mb-1">{locker.title}</h3>
                    <p className="text-gray-400 text-sm">{locker.views}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Created Lockers */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Created lockers</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search lockers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500/50"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Views chart</TableHead>
                    <TableHead className="text-gray-300">Views</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
                  ) : lockers.length === 0 ? (
                    <TableRow><TableCell colSpan={6}>No lockers found.</TableCell></TableRow>
                  ) : lockers.map((locker, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{locker.title}</p>
                            <p className="text-gray-400 text-sm">{locker.destination_url}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300 font-mono text-sm">{locker.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{locker.created_at ? new Date(locker.created_at).toLocaleDateString() : "-"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {lockerCharts[locker.id]?.chartData ? (
                            <MiniChart data={lockerCharts[locker.id].chartData} />
                          ) : (
                            <div className="w-[60px] h-[24px] bg-gray-800 rounded" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-medium">
                          {lockerCharts[locker.id]?.totalViews ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-white/10">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-white/10">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-white/10">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 hover:bg-white/10"
                            onClick={() => {
                              setSelectedLocker(locker)
                              setAnalyticsOpen(true)
                            }}
                            aria-label="View analytics"
                          >
                            <BarChart3 className="w-4 h-4 text-emerald-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Use filters in the table below for detailed sorting by date or views.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-2xl bg-[#18181b] text-white">
          <DialogTitle className="sr-only">
            Analytics Modal
          </DialogTitle>
          <h2 className="text-xl font-bold mb-4">
            Analytics for: <span className="font-mono text-emerald-400">{selectedLocker?.title}</span>
          </h2>
          {!lockerAnalytics ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lockerAnalytics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <Tooltip
                      contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend
                      wrapperStyle={{ color: '#fff' }}
                      iconType="circle"
                    />
                    <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} dot={false} name="Views" />
                    <Line type="monotone" dataKey="unlocks" stroke="#22c55e" strokeWidth={2} dot={false} name="Unlocks" />
                    <Line type="monotone" dataKey="tasks" stroke="#eab308" strokeWidth={2} dot={false} name="Tasks" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Views</div>
                  <div className="text-2xl font-bold text-white">{lockerAnalytics.overview.views}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Unlocks</div>
                  <div className="text-2xl font-bold text-white">{lockerAnalytics.overview.unlocks}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Task Completions</div>
                  <div className="text-2xl font-bold text-white">{lockerAnalytics.overview.taskCompletions}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Unlock Rate</div>
                  <div className="text-2xl font-bold text-white">{lockerAnalytics.overview.unlockRate.toFixed(1)}%</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
