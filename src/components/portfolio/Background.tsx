// Static background — server component, zero JavaScript, zero ongoing animation.
// Previously this animated 3-4 large blur-3xl orbs plus 12 particles forever,
// which continuously re-rasterized huge blurred surfaces on the GPU and pinned
// the CPU even while idle. The orbs are now fixed in place: the look is kept,
// the per-frame cost is gone.
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black" />

      {/* Static soft color orbs (no animation) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-600/30 blur-3xl" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-300/15 to-blue-400/15 dark:from-cyan-400/25 dark:to-blue-500/25 blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl" />

      {/* Faint grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20 dark:to-black/15" />
    </div>
  );
}
