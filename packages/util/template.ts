/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmptyObject } from './typeCheck';
import { josa } from './josa';

interface CompiledTemplateFunction {
  (data: any, j: typeof josa): string;
}

function getJosaRegexp() {
  return /^(을\/를|을|를|을를|은\/는|은|는|은는|이\/가|이|가|이가|와\/과|와|과|와과|으로\/로|으로|로|으로로|이\/)$/;
}

function parse(value: string) {
  const arr: string[] = [];
  let template = value;
  let result = /{(.*?)}/g.exec(template);
  let firstPos = -1;

  while (result) {
    firstPos = result.index;

    if (firstPos !== 0) {
      arr.push(template.substring(0, firstPos));
      template = template.slice(firstPos);
    }

    arr.push(result[0]);
    template = template.slice(result[0].length);
    result = /{(.*?)}/g.exec(template);
  }

  if (template) {
    arr.push(template);
  }

  return arr;
}

function compileToString(arr: string[]) {
  let result: string[] = ['\'\''];

  result = arr.reduce(
    (acc, tmp) => {
      let subTmp = '';

      if (tmp.startsWith('{') && tmp.endsWith('}')) {
        subTmp = tmp.split(/\{|\}/).filter(Boolean)[0].trim();
        if (getJosaRegexp().test(subTmp) && acc.latestTmp) {
          acc.result.push(`+j.c(d.${acc.latestTmp},'${subTmp}')`);
        } else {
          acc.result.push(`+d.${subTmp}`);
          acc.latestTmp = subTmp;
        }
      } else {
        acc.result.push(`+'${tmp.replace(/\n/gm, '\\n')}'`);
      }

      return acc;
    },
    { result, latestTmp: '' }
  ).result;

  return result.join('');
}

let compiledFns: Record<string, CompiledTemplateFunction> = {};

/**
 * 간단한 템플릿 메시지 처리기.
 *
 * 중괄호({})로 구성된 메시지 템플릿에 주어진 객체의 값을 이용하여 메시지를 완성한다.
 *
 * ```ts
 * const tmpl = '총 {totalCount}개의 상태가 {status}으로 바뀝니다.\n계속 하시겠습니까?';
 * const data = {
 *   totalCount: 320,
 *   status: '배송중',
 * };
 * const message = messageTemplate(tmpl, data);
 * // 총 320개의 상태가 배송중으로 바뀝니다.\n계속 하시겠습니까?
 * ```
 *
 * ### 한글 조사 처리
 *
 * 아래와 같이 템플릿 변수 우측에 파이프(|)와 해당하는 조사를 넣어주면 된다.
 *
 * ```ts
 * const tmpl = '이제 {name|으로}만 유효합니다.';
 *
 * messageTemplate(tmpl, { name: '원숭이' });
 * // 이제 원숭이로만 유효합니다.
 *
 * messageTemplate(tmpl, { name: '고객님' });
 * // 이제 고객님으로만 유효합니다.
 * ```
 *
 * @param tmplText 템플릿이 적용된 메시지
 * @param data 적용될 객체 데이터
 * @returns 만들어진 메시지
 */
export function messageTemplate<T extends Record<string, string | number>>(
  tmplText: string,
  data: T
) {
  if (!tmplText || !data || isEmptyObject(data)) {
    return '';
  }

  if (Array.isArray(data)) {
    throw new Error('messageTemplate: The "data" argument cannot be an array.');
  }

  let fn = compiledFns[tmplText];

  if (!fn) {
    fn = new Function(
      'd',
      'j',
      `return ${compileToString(messageTemplate.parse(tmplText))}`
    ) as CompiledTemplateFunction;

    compiledFns[tmplText] = fn;
  }

  return fn(data, josa);
}

messageTemplate.parse = parse;

messageTemplate.clear = function () {
  compiledFns = {};
};
