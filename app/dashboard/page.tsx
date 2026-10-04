"use client";

import { useRouter } from "next/navigation";
import { ForgeNav } from "../../components/ForgeNav";
import { XPBar } from "../../components/XPBar";
import { useForge } from "../../components/ForgeProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { player, activeCampaign, activeQuests, activeQuest, sessions, selectQuest, data } = useForge();
  const resumeQuest = data.activeFocusSession ? data.quests.find((quest) => quest.id === data.activeFocusSession?.questId) ?? null : null;
  const nextLesson = activeQuest ?? activeQuests.find((quest) => quest.status === "available") ?? null;

  function startRecommendedLesson() {
    if (nextLesson && selectQuest(nextLesson.id)) router.push("/focus");
  }

  return <main className="min-h-screen pb-12">
    <ForgeNav />
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-slate-500">Current campaign · {activeCampaign.title} · {activeCampaign.stage}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to build momentum, {player.name}?</h1>
          <p className="mt-2 text-slate-400">One focused session is enough to move your path forward.</p>
        </div>
        <div className="w-full rounded-2xl border border-teal-400/20 bg-teal-400/[.06] p-4 md:w-80">
          <div className="mb-3 flex justify-between text-sm"><span className="font-semibold text-white">Level {player.level}</span><span className="text-teal-200">{player.xp} XP</span></div>
          <XPBar current={player.xp} goal={player.xpToNextLevel} compact />
          <p className="mt-3 text-xs text-slate-500">{Math.max(0, player.xpToNextLevel - player.xp)} XP to level {player.level + 1}</p>
        </div>
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Metric label="Current streak" value={`${player.streak} days`} detail="Keep the chain alive" />
        <Metric label="Total focus" value={`${player.totalFocusMinutes}m`} detail={`${sessions.length} saved sessions`} />
        <Metric label="Campaign progress" value={`${activeCampaign.progress}%`} detail={`${activeCampaign.completed} of ${activeCampaign.total} lessons cleared`} />
      </div>

      <section className="mt-8 rounded-2xl border border-teal-400/25 bg-linear-to-r from-teal-400/[.10] to-[#101c2a] p-5 sm:p-6">
        {resumeQuest ? <>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-300">Quick Resume · Session saved</p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><h2 className="text-2xl font-semibold text-white">{resumeQuest.title}</h2><p className="mt-1 text-sm text-slate-400">Pick up exactly where you left off. Your timer and progress are saved on this device.</p><p className="mt-3 text-sm text-teal-100">{resumeQuest.difficulty} · {resumeQuest.estimatedMinutes} min · +{resumeQuest.xpReward} XP</p></div>
            <button type="button" onClick={() => router.push("/focus")} className="w-full shrink-0 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300 sm:w-auto">Resume focus →</button>
          </div>
        </> : nextLesson ? <>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-300">Your next lesson</p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><h2 className="text-2xl font-semibold text-white">{nextLesson.title}</h2><p className="mt-1 text-sm text-slate-400">{nextLesson.description}</p><p className="mt-3 text-sm text-teal-100">{nextLesson.difficulty} · {nextLesson.estimatedMinutes} min · +{nextLesson.xpReward} XP</p></div>
            <button type="button" onClick={startRecommendedLesson} className="w-full shrink-0 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300 sm:w-auto">Start lesson →</button>
          </div>
        </> : <>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-300">Your path</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Review your campaign to continue.</h2>
          <button type="button" onClick={() => router.push("/campaign")} className="mt-5 w-full rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300 sm:w-auto">Open campaign →</button>
        </>}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-2xl border border-slate-700 bg-[#101c2a] p-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-300">Your active campaign</p><h2 className="mt-2 text-2xl font-semibold text-white">{activeCampaign.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{activeCampaign.description}</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-teal-400" style={{ width: `${activeCampaign.progress}%` }} /></div><p className="mt-3 text-xs text-slate-500">{activeCampaign.stage} · {activeCampaign.progress}% complete</p></article>
        <article className="rounded-2xl border border-slate-700 bg-[#101c2a] p-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Recommended next step</p>{nextLesson ? <><h2 className="mt-3 text-xl font-semibold text-white">{nextLesson.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">Complete it to keep your stage moving toward its Boss Project.</p><button type="button" onClick={() => router.push("/campaign")} className="mt-5 text-sm font-bold text-teal-300 hover:text-teal-200">View campaign path →</button></> : <><p className="mt-3 text-sm text-slate-400">You are all caught up for now. Your campaign view has the next available option.</p><button type="button" onClick={() => router.push("/campaign")} className="mt-5 text-sm font-bold text-teal-300 hover:text-teal-200">Open campaign →</button></>}</article>
      </section>

      <section className="mt-10"><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Real-life stats</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(player.stats).map(([stat, value]) => <article key={stat} className="rounded-xl border border-slate-700 bg-[#101c2a] p-4"><div className="flex justify-between text-sm"><span className="text-slate-300">{stat}</span><span className="text-teal-300">{value}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-teal-400" style={{ width: `${Math.min(100, value)}%` }} /></div></article>)}</div></section>
      <section className="mt-10 rounded-2xl border border-slate-700 bg-[#101c2a] p-5"><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Recent sessions</p>{sessions.length ? <ul className="mt-4 space-y-3">{sessions.slice(0, 3).map((session) => <li key={session.id} className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:gap-4"><span className="text-slate-300">{session.questTitle}</span><span className="text-teal-300">{session.minutes}m · +{session.xpAwarded} XP</span></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Your focused work will appear here after your first session.</p>}</section>
    </div>
  </main>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded-xl border border-slate-700 bg-[#101c2a] p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}
