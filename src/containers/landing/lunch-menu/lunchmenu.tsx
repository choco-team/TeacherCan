'use client';

import { Utensils } from 'lucide-react';
import SectionTitle from '../components/section-title';
import LunchMenuSearch from './lunchmenu-search/lunchmenu-search';

function LunchMenu() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionTitle Icon={Utensils} title="점심 메뉴" />
      <LunchMenuSearch />
    </div>
  );
}

export default LunchMenu;
