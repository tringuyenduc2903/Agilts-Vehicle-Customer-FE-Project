'use client';
import { defaultCountry } from '@/config/config';
import { ModalContext } from '@/contexts/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/lib/redux/query/countryQuery';
import { usePostAddressMutation } from '@/lib/redux/query/userQuery';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { FaCheck } from 'react-icons/fa6';
type PartOfCountry = {
  id: string;
  name: string;
  name_en: string;
};
type Form = {
  province: {
    code: string;
    name: string;
    name_en: string;
  };
  district: {
    code: string;
    name: string;
    name_en: string;
  };
  ward: {
    code: string;
    name: string;
    name_en: string;
  };
  address_detail: string;
  default: boolean;
  type: null | number;
};
function AddAddressModal() {
  const { locale } = useParams();
  const t = useTranslations('common');
  const { state, setVisibleModal } = useContext(ModalContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleAddAddressModal')
  );
  const [country, setCountry] = useState<Form>({
    province: {
      code: '',
      name: '',
      name_en: '',
    },
    district: {
      code: '',
      name: '',
      name_en: '',
    },
    ward: {
      code: '',
      name: '',
      name_en: '',
    },
    address_detail: '',
    default: false,
    type: null,
  });
  const [curTab, setCurTab] = useState<string | null>(null);
  const { data: provincesData, isSuccess: isSuccessProvinces } =
    useGetProvincesQuery(null);
  const { data: districtsData, isSuccess: isSuccessDistricts } =
    useGetDistrictsQuery(country.province.code, {
      skip: !country.province.code,
    });
  const { data: wardsData, isSuccess: isSuccessWards } = useGetWardsQuery(
    country.district.code,
    { skip: !country.district.code }
  );
  const [
    postAddress,
    {
      isLoading: isLoadingPost,
      isSuccess: isSuccessPost,
      isError: isErrorPost,
      error: errorPost,
    },
  ] = usePostAddressMutation();
  const errors = useMemo(() => {
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorPost, errorPost]);
  const handleChangeTab = useCallback(
    (tab: string) => {
      setCurTab((prevTab) => {
        if (tab === prevTab) return null;
        return tab;
      });
    },
    [curTab]
  );
  const handleSelectCountry = useCallback(
    (name: string, name_en: string, value: string, code: string) => {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          [name]: {
            name: value,
            name_en: name_en,
            code: code,
          },
        };
      });
      setCurTab(null);
    },
    [country, curTab]
  );
  const renderedProvinces = useMemo(() => {
    return (
      isSuccessProvinces &&
      provincesData?.data?.map((p: PartOfCountry) => {
        return (
          <li className='w-full' key={p?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry('province', p?.name_en, p?.name, p?.id)
              }
              disabled={isLoadingPost}
            >
              {p?.name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessProvinces, provincesData, isLoadingPost]);
  const renderedDistricts = useMemo(() => {
    return (
      isSuccessDistricts &&
      districtsData?.data?.map((d: PartOfCountry) => {
        return (
          <li className='w-full' key={d?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry('district', d?.name_en, d?.name, d?.id)
              }
              disabled={isLoadingPost}
            >
              {d?.name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessDistricts, districtsData, isLoadingPost]);
  const renderedWards = useMemo(() => {
    return (
      isSuccessWards &&
      wardsData?.data?.map((w: PartOfCountry) => {
        return (
          <li className='w-full' key={w?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry('ward', w?.name_en, w?.name, w?.id)
              }
              disabled={isLoadingPost}
            >
              {w?.name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessWards, wardsData, isLoadingPost]);
  useEffect(() => {
    if (!state.visibleAddAddressModal) {
      setCountry({
        province: {
          code: '',
          name: '',
          name_en: '',
        },
        district: {
          code: '',
          name: '',
          name_en: '',
        },
        ward: {
          code: '',
          name: '',
          name_en: '',
        },
        address_detail: '',
        default: false,
        type: null,
      });
    }
  }, [state.visibleAddAddressModal]);
  useLayoutEffect(() => {
    if (country.province.code) {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          district: {
            code: '',
            name: '',
            name_en: '',
          },
          ward: {
            code: '',
            name: '',
            name_en: '',
          },
        };
      });
    }
  }, [country.province.code]);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await postAddress({
        default: country.default,
        type: country.type,
        country: defaultCountry,
        province: country.province.name,
        district: country.district.name,
        ward: country.ward.name,
        address_detail: country.address_detail,
      });
    },
    [postAddress, country, defaultCountry]
  );
  useEffect(() => {
    if (isSuccessPost) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: t('mess_add_address'),
        },
      });
    }
  }, [isSuccessPost, setVisibleModal, t]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => clickOutside}
    >
      <form
        method='POST'
        className='bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-w-[500px] w-full'
        ref={sectionRef as LegacyRef<HTMLFormElement>}
        onSubmit={handleSubmit}
      >
        <div className='flex justify-between gap-4'>
          <h1 className='text-lg md:text-xl font-bold'>{t('add_address')}</h1>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('provinces')}
              disabled={isLoadingPost}
            >
              {country?.province?.name
                ? locale === 'vi'
                  ? country.province.name
                  : country.province.name_en
                : t('select_province')}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'provinces' ? 'h-[364px] border' : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  {t('select_province')}
                </button>
              </li>
              {renderedProvinces}
            </ul>
            {errors?.province && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.province[0]}
              </p>
            )}
          </div>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('districts')}
              disabled={isLoadingPost}
            >
              {country?.district?.name
                ? locale === 'vi'
                  ? country.district.name
                  : country.district.name_en
                : t('select_district')}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'districts'
                  ? isSuccessDistricts
                    ? 'h-[364px] border'
                    : 'h-[40px] border'
                  : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  {t('select_district')}
                </button>
              </li>
              {renderedDistricts}
            </ul>
            {errors?.district && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.district[0]}
              </p>
            )}
          </div>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('wards')}
              disabled={isLoadingPost}
            >
              {country?.ward?.name
                ? locale === 'vi'
                  ? country.ward.name
                  : country.ward.name_en
                : t('select_ward')}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'wards'
                  ? isSuccessWards
                    ? 'h-[364px] border'
                    : 'h-[40px] border'
                  : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  {t('select_ward')}
                </button>
              </li>
              {renderedWards}
            </ul>
            {errors?.ward && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.ward[0]}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='text-sm md:text-base w-full border border-neutral-400 px-4 py-2'
              type='text'
              placeholder={`${t('address_details')}...`}
              value={country.address_detail}
              onChange={(e) =>
                setCountry({ ...country, address_detail: e.target.value })
              }
              disabled={isLoadingPost}
            />
            {errors?.address_detail && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.address_detail[0]}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm md:text-base'>{t('type_of_address')}:</p>
          <div className='flex items-center gap-4'>
            <button
              className={`text-sm md:text-base border ${
                country.type === 0
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 0 })}
              disabled={isLoadingPost}
            >
              {t('type_home')}
            </button>
            <button
              className={`text-sm md:text-base border ${
                country.type === 1
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 1 })}
              disabled={isLoadingPost}
            >
              {t('type_office')}
            </button>
          </div>
          {errors?.type && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.type[0]}
            </p>
          )}
        </div>
        <div className='w-full'>
          <button
            type='button'
            className='text-sm md:text-base w-max flex justify-start items-center gap-2'
            onClick={() =>
              setCountry({ ...country, default: !country.default })
            }
            disabled={isLoadingPost}
          >
            <span
              className={`relative w-[18px] h-[18px] ${
                country.default ? 'bg-red-500' : 'border border-neutral-400'
              } rounded-sm text-white`}
            >
              {country.default && (
                <FaCheck className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' />
              )}
            </span>
            <p>{t('set_default_address')}</p>
          </button>
        </div>
        <div className='w-full flex justify-end items-center gap-4'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleAddAddressModal')}
            disabled={isLoadingPost}
          >
            {t('return')}
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            disabled={isLoadingPost}
          >
            {isLoadingPost ? `${t('loading')}...` : t('complete')}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddAddressModal;
