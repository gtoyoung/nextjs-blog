import React, { useEffect, useRef, useState } from "react";
import { Layout } from "components/layout";
import { GetStaticProps } from "next";
import { PokeApi } from "services/poke";
import { PoketInfo } from "services/poke.types";
import FbDatabase from "services/firebase/database";
import PokemonCard from "components/poke/pokemonCard";
import { Pokemons } from "../../components/poke/indexStyle";
// import { PokeSearchBox } from "components/poke/pokeSearchbox";

const db = new FbDatabase(false);
const pokeApi = new PokeApi();

export const getStaticProps: GetStaticProps = async () => {
  const nameList = await db.getPokeNameList();
  const pokeList = await pokeApi.getPoketList(0, 21);
  const result = JSON.stringify(pokeList);
  return {
    props: {
      result,
      nameList,
    },
  };
};

const PokePage = ({ result, nameList }: { result: any; nameList: any[] }) => {
  const perPage = 21;
  let currentPage = 21;
  const jsonConvert = JSON.parse(result);
  const pokeList: PoketInfo[] = jsonConvert;
  const [loaded, setLoaded] = useState(false);
  const [pokemons, setPokemons] = useState([] as PoketInfo[]);
  //무한로딩을 위한 작업
  const cardListRef = useRef(null);
  const onIntersect = ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pokeApi
        .getPoketList(currentPage, perPage)
        .then((res) => {
          if (res != null) {
            setPokemons((prev) => [...prev, ...res]);
          } else {
            setLoaded(true);
          }
        })
        .catch(() => {
          setLoaded(true);
        })
        .finally(() => {
          currentPage += perPage;
          observer.observe(entry.target);
        });
    }
  };
  // 초기데이터 셋팅
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    observer.observe(cardListRef.current);
    setPokemons(pokeList);
    return () => observer.disconnect();
  }, []);

  // 한글이름으로 변환
  const convertKorName = (name: string) => {
    var result = nameList.find((element) => {
      if (element.en.toUpperCase() === name.toUpperCase()) return true;
    });

    return result?.ko || name;
  };

  return (
    <>
      <Layout isMax={true}>
        <div>
          <h1>Poke Page</h1>
          {/* <PokeSearchBox
          pokemons={pokemons}
          nameList={nameList}
          changePokemon={(pokemon) => {
            console.log(pokemon);
          }}
        /> */}
          <div>
            <Pokemons>
              {pokemons.map((item) => {
                return (
                  <PokemonCard
                    koName={
                      convertKorName(item.name)
                        ? convertKorName(item.name)
                        : item.name
                    }
                    poke={item}
                  />
                );
              })}
            </Pokemons>
            {!loaded && (
              <div ref={cardListRef}>
                <h3>Loading...</h3>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PokePage;
