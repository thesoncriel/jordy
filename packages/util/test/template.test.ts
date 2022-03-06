import { messageTemplate } from '../template';

describe('messageTemplate.parse', () => {
  it('템플릿이 입력되면 1차적으로 분석하여 배열로 분해한다.', () => {
    const given = '그래서 {who}와 함께 {work}를 하시겠습니까?';
    const result = messageTemplate.parse(given);

    expect(result).toEqual([
      '그래서 ',
      '{who}',
      '와 함께 ',
      '{work}',
      '를 하시겠습니까?',
    ]);
  });
  it('여러행으로 구성되어도 의도대로 만들어진다.', () => {
    const given =
      '그래서 {who}와 함께\n{work}를 하시겠습니까?\n새로운 {day}를 위해!';
    const result = messageTemplate.parse(given);

    expect(result).toEqual([
      '그래서 ',
      '{who}',
      '와 함께\n',
      '{work}',
      '를 하시겠습니까?\n새로운 ',
      '{day}',
      '를 위해!',
    ]);
  });
});

describe('messageTemplate', () => {
  afterEach(() => {
    messageTemplate.clear();
  });

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
  it('템플릿에 html tag 가 있어도 정상적으로 적용된다.', () => {
    const result = messageTemplate(
      '<strong class="red">최대 {count}개 만큼</strong> 적용 하실래요?',
      {
        count: 15,
      }
    );
    expect(result).toBe(
      '<strong class="red">최대 15개 만큼</strong> 적용 하실래요?'
    );
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
  it('조사가 템플릿에 있을 경우, 들어온 명사에 대하여 적용된다.', () => {
    const template = '곧바로 {word}{을를} 시작합니다!';
    const result1 = messageTemplate(template, {
      word: '엑셀 작업',
    });
    const result2 = messageTemplate(template, {
      word: '마케팅 통화',
    });
    expect(result1).toBe('곧바로 엑셀 작업을 시작합니다!');
    expect(result2).toBe('곧바로 마케팅 통화를 시작합니다!');
  });
  it('(이)가 붙는 보조사도 정상 동작한다.', () => {
    const template = '{sonic} {sonic} 바람돌이 {sonic} 우리들의 {word}{이/}야~';
    const result1 = messageTemplate(template, {
      sonic: '소닉',
      word: '친구',
    });
    const result2 = messageTemplate(template, {
      sonic: '에그맨',
      word: '영웅',
    });

    expect(result1).toBe('소닉 소닉 바람돌이 소닉 우리들의 친구야~');
    expect(result2).toBe('에그맨 에그맨 바람돌이 에그맨 우리들의 영웅이야~');
  });
  it('특정 템플릿을 컴파일 하면 두번 다시 같은 컴파일을 수행하지 않는다.', () => {
    const spiedFn = jest.spyOn(messageTemplate, 'parse');
    const template = '{sonic} {sonic} 바람돌이 {sonic} 우리들의 {word}{이/}야~';
    messageTemplate(template, {
      sonic: '소닉',
      word: '친구',
    });
    messageTemplate(template, {
      sonic: '에그맨',
      word: '영웅',
    });

    expect(spiedFn).toBeCalledTimes(1);

    spiedFn.mockRestore();
  });
  it('조사 앞에 태그가 있어도 정상적으로 동작된다.', () => {
    const template =
      '정말로 <strong>{count}건의 {name}</strong>{을를} 하시겠습니까?\n<u>{name}</u>{이가} 진행되면 되돌릴 수 없습니다.';
    const result = messageTemplate(template, {
      count: 3,
      name: '정보처리',
    });

    expect(result).toBe(
      '정말로 <strong>3건의 정보처리</strong>를 하시겠습니까?\n<u>정보처리</u>가 진행되면 되돌릴 수 없습니다.'
    );
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
