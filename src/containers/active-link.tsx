'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import theme from '@/style/theme';

function ActiveLink({ children, href }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const style = {
    marginRight: 10,
    color: isActive ? 'red' : theme.colors.primary[500],
  };

  // 클릭 핸들러
  const handleClick = (e) => {
    e.preventDefault();
    window.open(href, '_blank'); // 새 탭에서 열기
  };

  // children이 React 요소일 경우 클릭 이벤트를 props로 전달
  const enhancedChildren = React.cloneElement(children, {
    onClick: handleClick, // 클릭 핸들러 전달
    style: { ...children.props.style, cursor: 'pointer', ...style }, // 스타일 병합
  });

  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      tabIndex={0}
      style={{ cursor: 'default' }}
    >
      {enhancedChildren}
    </a>
  );
}

export default ActiveLink;
