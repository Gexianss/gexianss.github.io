// 共用品牌符號：雙圈徽記 + 中央 </>。
// 三處共用同一份結構：左上 logo（靜態）、loading 簾幕（中央 </> 旋轉）、
// PWA icon（gen-icons.py 以相同造型同步產生）。
// 描邊「顏色」交給各自 CSS module 的 stroke（可繼承），「粗細」用 inline 控制。

// 中央 </> 三筆：左箭括號、斜線、右箭括號（縮在雙圈內，viewBox 0 0 100 100）
const CODE_PATHS = ['M44,41 L34,50 L44,59', 'M55,38 L45,62', 'M56,41 L66,50 L56,59'];

const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

// 雙圈徽記。codeClassName 可掛在中央 </> 群組上（loading 用來旋轉）。
// outerRing=false 時省略最外圈——圓形 logo 的容器外框本身就是外圈，避免三圈疊太多。
export function CodeBadge({ codeClassName, outerRing = true, ...props }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      {outerRing && <circle cx="50" cy="50" r="40" style={{ ...stroke, strokeWidth: 4 }} />}
      <circle cx="50" cy="50" r="33" style={{ ...stroke, strokeWidth: 3 }} />
      <g className={codeClassName}>
        {CODE_PATHS.map((d) => (
          <path key={d} d={d} style={{ ...stroke, strokeWidth: 5 }} />
        ))}
      </g>
    </svg>
  );
}
