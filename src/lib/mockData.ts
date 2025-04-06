// src/lib/mockData.ts

// スコアごとのコメントリスト
const skinComments: Record<number, string[]> = {
  10: ['肌のコンディションは最高！', 'ツヤがあり、乾燥も油分もなし！', '理想的なスキンコンディション！'],
  9: ['肌の調子がとてもいいですね。', '乾燥・テカリもほぼ気になりません。', '安定した肌状態をキープしています。'],
  8: ['やや乾燥気味ですが良好です。', 'テカリが少し気になるかも？', 'おおむね良い肌状態です。'],
  7: ['乾燥またはオイリー傾向あり。', '肌の調子を整えたいところです。', '保湿ケアを意識しましょう。'],
};

const topComments: Record<number, string[]> = {
  10: ['髪型バッチリ決まってます！', 'サイド・トップのバランス最高！', 'セット完璧です。'],
  9: ['ほぼ完璧なスタイリングです。', '若干サイドが重いかも？', 'まとまりが良いですね。'],
  8: ['少しサイドが伸びすぎかも？', 'セットにもうひと工夫を。', 'スタイルは概ね良好です。'],
  7: ['全体のバランスに注意が必要です。', 'ヘアセットを整え直しましょう。', 'トップにボリュームを。'],
};

const underComments: Record<number, string[]> = {
  10: ['ひげ剃り完璧！清潔感抜群です。', '無精ひげゼロ！爽やかです。', 'ひげの手入れが行き届いています。'],
  9: ['ほぼキレイに剃れています。', 'わずかな青ひげあり？', '細かい剃り残しに注意。'],
  8: ['やや青ひげが目立つかも。', '剃り残しが気になる箇所あり。', 'もう一度剃るとより爽やかに。'],
  7: ['無精ひげが少し目立つかも。', '全体的に剃り直しをおすすめ。', '清潔感を意識しましょう。'],
};

const totalComments: Record<number, string[]> = {
  100: ['完璧な爽やかさ！', '清潔感パーフェクト！', '誰からも好印象！'],
  90: ['非常に爽やかな印象です。', '好印象を与えています。', '堂々とした清潔感です。'],
  80: ['十分に爽やかです。', '細部に気をつければさらに良し。', '好感度は高めです。'],
  70: ['やや改善の余地あり。', '全体的な清潔感を高めましょう。', '細かい部分を意識しましょう。'],
};

// おすすめ商品
export const recommendItems = {
  skin: {
    name: 'ルシード (LUCIDO) 薬用パーフェクトスキンクリームEX (医薬部外品)',
    image: 'https://www.mandom.co.jp/storage/images/product/1726405174.jpg',
    text: '年齢とともに気になる肌悩みに、簡単これ1品。ベタつかず高保湿。無香料・無着色・防腐剤フリー。',
    link: 'https://www.mandom.co.jp/products/detail.html?id=012148'
  },
  top: {
    name: 'ルシード (LUCIDO) ヘアクリーム',
    image: 'https://www.mandom.co.jp/storage/images/product/1726405658.jpg',
    text: '髪にスッとなじみ、ベタつかずまとまる。無香料・無着色・防腐剤無配合。',
    link: 'https://www.mandom.co.jp/products/detail.html?id=045265'
  },
  under: {
    name: 'ルシード (LUCIDO) アフターシェーブローション',
    image: 'https://www.mandom.co.jp/storage/images/product/1726405684.jpg',
    text: '無香料だから香りが気にならない。やさしく肌を整え、うるおいを与えます。',
    link: 'https://www.mandom.co.jp/products/detail.html?id=054788'
  }
};

// 7〜10のランダム
const getRandomScore = () => Math.floor(Math.random() * 4) + 7;

// コメント取得（スコアに応じたコメントをランダムで選ぶ）
const getRandomComment = (comments: Record<number, string[]>, score: number, type: 'skin' | 'top' | 'under' | 'total') => {
  let roundedScore: number;

  if (type === 'total') {
    // totalは70/80/90/100に丸める
    roundedScore = score >= 95 ? 100 : score >= 85 ? 90 : score >= 75 ? 80 : 70;
  } else {
    // 他は7/8/9/10に丸める
    roundedScore = score >= 9.5 ? 10 : score >= 8.5 ? 9 : score >= 7.5 ? 8 : 7;
  }

  const options = comments[roundedScore];
  return options[Math.floor(Math.random() * options.length)];
};


export const generateRandomFaceScore = () => {
  const skinScore = getRandomScore();
  const topScore = getRandomScore();
  const underScore = getRandomScore();

  const average = (skinScore + topScore + underScore) / 3;
  let totalScore = Math.round(average * 10);
  if (totalScore < 70) totalScore = 70;
  if (totalScore > 100) totalScore = 100;

  // 🔥 一番点数が低いパーツを探す
  const minScore = Math.min(skinScore, topScore, underScore);
  let recommendType: 'skin' | 'top' | 'under' = 'skin';
  if (minScore === topScore) recommendType = 'top';
  if (minScore === underScore) recommendType = 'under';

  return {
    skin: {
      score: skinScore,
      comment: getRandomComment(skinComments, skinScore, 'skin')
    },
    top: {
      score: topScore,
      comment: getRandomComment(topComments, topScore, 'top')
    },
    under: {
      score: underScore,
      comment: getRandomComment(underComments, underScore, 'under')
    },
    total: {
      score: totalScore,
      comment: getRandomComment(totalComments, totalScore, 'total') 
    },
    recommendItem: recommendItems[recommendType]
  };
};
