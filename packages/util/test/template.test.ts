import { messageTemplate } from '../template';

describe('messageTemplate', () => {
  it('중괄호({})가 포함된 템플릿과 객체를 넘겨주면 그 객체의 값이 템플릿에 적용된다.', () => {
    const result = messageTemplate('{one}둘셋{four}다섯!', {
      one: '하나',
      four: '넷',
    });
    expect(result).toBe('하나둘셋넷다섯!');
  });
  it('엔터와 특수기호가 포함된 템플릿도 정상적으로 적용된다.', () => {
    const result = messageTemplate(
      '{count}개가 적용됩니다.\n*****\n정말로 {status}으로 바꾸시겠습니까?',
      {
        count: 15,
        status: '배송중',
      }
    );
    expect(result).toBe(
      '15개가 적용됩니다.\n*****\n정말로 배송중으로 바꾸시겠습니까?'
    );
  });
  it('템플릿에 같은 키가 여러개가 있어도 정상적으로 적용된다.', () => {
    const result = messageTemplate(
      '구입 개수: {count}개\n가격: {price}\n전체 가격: {count} * {price}',
      {
        count: 105,
        price: 1000,
      }
    );
    expect(result).toBe('구입 개수: 105개\n가격: 1000\n전체 가격: 105 * 1000');
  });
  it('적용될 자료가 빈 객체라면 빈 문자열을 내보낸다.', () => {
    const result = messageTemplate(
      '구입 개수: {count}개\n가격: {price}\n전체 가격: {count} * {price}',
      {}
    );
    expect(result).toBe('');
  });
  it('템플릿 내용이 비어있다면 빈 문자열을 내보낸다.', () => {
    const result = messageTemplate('', {
      count: 105,
      price: 1000,
    });
    expect(result).toBe('');
  });
  it('적용될 자료의 필드 타입이 문자열이나 숫자가 아니면 오류를 일으킨다.', () => {
    const executor = () =>
      messageTemplate('구입 개수: {count}개\n동의 여부: {yesOrNo}', {
        yesOrNo: true,
        count: 12,
      } as unknown as Record<string, number | string>);
    expect(executor).toThrowError('is not valid.');
  });
  it('적용될 자료가 배열이면 오류를 일으킨다.', () => {
    const executor = () =>
      messageTemplate('구입 개수: {count}개\n동의 여부: {yesOrNo}', [
        {
          count: 12,
          yesOrNo: '예',
        },
      ] as unknown as Record<string, number | string>);
    expect(executor).toThrowError('cannot be an array.');
  });
});
