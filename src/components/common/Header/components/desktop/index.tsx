'user client';
import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/borko-logo-black.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
function DesktopNavigation() {
  const { t } = useTranslation('header');
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className='fixed bg-white text-neutral-800 w-full top-0 left-0 z-50 px-8 flex justify-between h-[72px] items-center'>
      <span
        className={`fixed top-0 left-0 ${
          hoverRoute
            ? 'w-full h-full z-10 opacity-100'
            : 'w-0 h-0 -z-10 opacity-0'
        } transition-opacity duration-300`}
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      ></span>
      <button aria-label='btn-back-home' onClick={() => router.push('/')}>
        <Image width={170} height={70} src={logo} alt='logo' />
      </button>
      <section className='relative z-50 h-full flex items-center font-bold tracking-[1px]'>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverRoute === 'home' ? 'bg-white' : ''
          }`}
          href={'/'}
          onMouseEnter={() => setHoverRoute('home')}
          onMouseLeave={() => setHoverRoute(null)}
        >
          <p className='relative py-1'>
            <span>{t('home')}</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverRoute === 'home' || pathname === '/' ? 'w-8' : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-200`}
            ></span>
          </p>
        </Link>
        <div
          className={`relative h-full px-4 cursor-pointer ${
            hoverRoute === 'pages' ? 'bg-white' : ''
          }`}
          onMouseEnter={() => setHoverRoute('pages')}
          onMouseLeave={() => setHoverRoute(null)}
        >
          <button
            className={`w-full h-full uppercase flex justify-center items-center px-4 ${
              hoverRoute === 'pages' ? 'bg-white' : ''
            }`}
          >
            <p className='relative py-1'>
              <span>{t('pages')}</span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                  hoverRoute === 'pages' ||
                  ['about-us', 'our-services', 'contact-us'].includes(pathname)
                    ? 'w-8'
                    : 'w-0'
                } h-[2px] bg-red-500 transition-all duration-200`}
              ></span>
            </p>
          </button>
          <ul
            className={`absolute left-0 w-[240px] ${
              hoverRoute === 'pages' ? 'h-[240px]' : 'h-0'
            } transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden`}
          >
            <li className='w-full px-4 pt-12'>
              <Link
                className='relative w-full h-[48px] flex items-center gap-2 px-4'
                href={'/about-us'}
                onMouseOver={() => setHoverSubRoute('about-us')}
                onMouseOut={() => setHoverSubRoute(null)}
              >
                <span className='w-6 h-[2px] bg-red-600'></span>
                <span
                  className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                    hoverSubRoute === 'about-us'
                      ? 'translate-x-[20%]'
                      : 'translate-x-0'
                  } bg-white transition-all duration-200`}
                >
                  {t('about-us')}
                </span>
              </Link>
            </li>
            <li className='w-full px-4'>
              <Link
                className='relative w-full h-[48px] flex items-center gap-2 px-4'
                href={'/our-services'}
                onMouseOver={() => setHoverSubRoute('our-services')}
                onMouseOut={() => setHoverSubRoute(null)}
              >
                <span className='w-6 h-[2px] bg-red-600'></span>
                <span
                  className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                    hoverSubRoute === 'our-services'
                      ? 'translate-x-[20%]'
                      : 'translate-x-0'
                  } bg-white transition-all duration-200`}
                >
                  {t('our-services')}
                </span>
              </Link>
            </li>
            <li className='w-full pb-8 px-4'>
              <Link
                className='relative w-full h-[48px] flex items-center gap-2 px-4'
                href={'/contact'}
                onMouseOver={() => setHoverSubRoute('contact')}
                onMouseOut={() => setHoverSubRoute(null)}
              >
                <span className='w-6 h-[2px] bg-red-600'></span>
                <span
                  className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                    hoverSubRoute === 'contact'
                      ? 'translate-x-[20%]'
                      : 'translate-x-0'
                  } bg-white transition-all duration-200`}
                >
                  {t('contact-us')}
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverRoute === 'shop' ? 'bg-white' : ''
          }`}
          href={'/shop'}
          onMouseEnter={() => setHoverRoute('shop')}
          onMouseLeave={() => setHoverRoute(null)}
        >
          <p className='relative py-1'>
            <span>{t('shop')}</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverRoute === 'shop' || pathname === '/shop' ? 'w-8' : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-200`}
            ></span>
          </p>
        </Link>
      </section>
      <section></section>
    </header>
  );
}

export default DesktopNavigation;