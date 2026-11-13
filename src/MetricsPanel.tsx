import type {Entry} from './review';
import {formatMetrics,questionMetrics} from './learningMetrics';

export function LearningMetrics({history}:{history:Entry[]}){const formats=formatMetrics(history),hard=questionMetrics(history);return <section className="learning-metrics"><h3>学習データ分析（この端末のみ）</h3><p className="muted">正答率・回答時間・ヒント利用から、次に確認したい形式を探します。データは外部へ送信しません。</p>{formats.length?<><h4>問題形式別</h4>{formats.map(m=><p key={m.key}>{m.label}：正答率{Math.round(m.accuracy*100)}%／平均{Math.round(m.averageSeconds)}秒／ヒント{Math.round(m.hintRate*100)}%（{m.attempts}問）</p>)}<h4>要確認の問題</h4>{hard.map(m=><p key={m.key}>{m.label}：{m.correct}/{m.attempts}問正解</p>)}</>:<p>回答すると、ここに形式別の傾向が表示されます。</p>}</section>;}
