/**
 * Short why + example for each questionnaire chapter.
 */
const ChapterIntro = ({ kicker, title, why }) => (
  <header className="mb-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
      {kicker}
    </p>
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h2>
    {why && (
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {why}
      </p>
    )}
  </header>
)

export default ChapterIntro
